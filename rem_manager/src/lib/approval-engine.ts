import type { PrismaClient, ApprovalRule, ApprovalStatus } from '@prisma/client'

type PrismaT = PrismaClient

export async function resolveApprovalChain(
  expenseId: string,
  rule: ApprovalRule & { steps: { id: string; approverId: string; sequence: number }[] },
  submitter: { id: string; managerId: string | null },
  prismaClient: PrismaT
) {
  let seq = 0

  if (rule.isManagerApprover && submitter.managerId) {
    await prismaClient.expenseApproval.create({
      data: {
        expenseId,
        approverId: submitter.managerId,
        sequence: seq,
        status: 'PENDING',
      },
    })
    seq++
  }

  const firstStep = rule.steps.sort((a, b) => a.sequence - b.sequence)[0]
  if (firstStep) {
    await prismaClient.expenseApproval.create({
      data: {
        expenseId,
        approverId: firstStep.approverId,
        sequence: seq,
        status: 'PENDING',
      },
    })
  }
}

export async function advanceApproval(expenseId: string, prismaClient: PrismaT) {
  const expense = await prismaClient.expense.findUnique({
    where: { id: expenseId },
    include: {
      approvals: { orderBy: { sequence: 'asc' } },
    },
  })

  if (!expense) return

  const approvals = expense.approvals

  // If any rejected → reject expense
  if (approvals.some((a) => a.status === 'REJECTED')) {
    await prismaClient.expense.update({
      where: { id: expenseId },
      data: { status: 'REJECTED' },
    })
    return
  }

  // Find matching rule
  const rule = await prismaClient.approvalRule.findFirst({
    where: {
      company: { expenses: { some: { id: expenseId } } },
      minAmount: { lte: expense.amountInCompanyCurrency },
    },
    include: { steps: { orderBy: { sequence: 'asc' } } },
    orderBy: { minAmount: 'desc' },
  })

  if (!rule) {
    // No rule: just approve
    await prismaClient.expense.update({
      where: { id: expenseId },
      data: { status: 'APPROVED' },
    })
    return
  }

  const { resolved, outcome } = evaluateCondition(rule, approvals)
  if (resolved && outcome === 'APPROVED') {
    await prismaClient.expense.update({
      where: { id: expenseId },
      data: { status: 'APPROVED' },
    })
    return
  }

  // Check if there are more steps to create
  const maxSeq = approvals.reduce((m, a) => Math.max(m, a.sequence), -1)
  const nextStep = rule.steps.find((s) => s.sequence > maxSeq - (rule.isManagerApprover ? 1 : 0))

  if (nextStep && approvals.every((a) => a.status !== 'PENDING')) {
    await prismaClient.expenseApproval.create({
      data: {
        expenseId,
        approverId: nextStep.approverId,
        sequence: maxSeq + 1,
        status: 'PENDING',
      },
    })
  } else if (approvals.every((a) => a.status !== 'PENDING')) {
    // All approved, no more steps
    await prismaClient.expense.update({
      where: { id: expenseId },
      data: { status: 'APPROVED' },
    })
  }
}

function evaluateCondition(
  rule: ApprovalRule,
  approvals: { status: ApprovalStatus; approverId: string }[]
): { resolved: boolean; outcome: 'APPROVED' | null } {
  const approved = approvals.filter((a) => a.status === 'APPROVED').length
  const total = approvals.length

  switch (rule.conditionType) {
    case 'NONE': {
      if (total === 0) return { resolved: false, outcome: null }
      const allApproved = approvals.every((a) => a.status === 'APPROVED')
      return { resolved: allApproved, outcome: allApproved ? 'APPROVED' : null }
    }
    case 'PERCENTAGE': {
      if (!rule.percentageThreshold || total === 0) return { resolved: false, outcome: null }
      const pct = (approved / total) * 100
      if (pct >= rule.percentageThreshold) return { resolved: true, outcome: 'APPROVED' }
      return { resolved: false, outcome: null }
    }
    case 'SPECIFIC_APPROVER': {
      const met = approvals.some(
        (a) => a.approverId === rule.specificApproverId && a.status === 'APPROVED'
      )
      return { resolved: met, outcome: met ? 'APPROVED' : null }
    }
    case 'HYBRID': {
      const pctMet =
        rule.percentageThreshold != null &&
        total > 0 &&
        (approved / total) * 100 >= rule.percentageThreshold
      const specificMet = approvals.some(
        (a) => a.approverId === rule.specificApproverId && a.status === 'APPROVED'
      )
      const met = pctMet || specificMet
      return { resolved: met, outcome: met ? 'APPROVED' : null }
    }
    default:
      return { resolved: false, outcome: null }
  }
}

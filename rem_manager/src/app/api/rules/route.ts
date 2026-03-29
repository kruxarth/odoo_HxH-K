import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPrisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const prisma = await getPrisma()
  const rules = await prisma.approvalRule.findMany({
    where: { companyId: session.user.companyId },
    include: {
      steps: {
        orderBy: { sequence: 'asc' },
        include: { approver: { select: { id: true, name: true } } },
      },
    },
    orderBy: { minAmount: 'asc' },
  })
  return NextResponse.json(rules)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const {
    name, minAmount, maxAmount, isManagerApprover,
    conditionType, percentageThreshold, specificApproverId, steps,
  } = await req.json()

  const prisma = await getPrisma()
  const rule = await prisma.$transaction(async (tx) => {
    const created = await tx.approvalRule.create({
      data: {
        name,
        companyId: session.user.companyId,
        minAmount: Number(minAmount ?? 0),
        maxAmount: maxAmount != null ? Number(maxAmount) : null,
        isManagerApprover: Boolean(isManagerApprover),
        conditionType: conditionType ?? 'NONE',
        percentageThreshold: percentageThreshold != null ? Number(percentageThreshold) : null,
        specificApproverId: specificApproverId ?? null,
      },
    })
    if (Array.isArray(steps) && steps.length > 0) {
      await tx.approvalStep.createMany({
        data: steps.map((s: { approverId: string; sequence: number; label?: string }) => ({
          ruleId: created.id,
          approverId: s.approverId,
          sequence: s.sequence,
          label: s.label ?? null,
        })),
      })
    }
    return tx.approvalRule.findUnique({
      where: { id: created.id },
      include: { steps: { orderBy: { sequence: 'asc' } } },
    })
  })

  return NextResponse.json(rule, { status: 201 })
}

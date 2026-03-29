import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPrisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await context.params
  const {
    name, minAmount, maxAmount, isManagerApprover,
    conditionType, percentageThreshold, specificApproverId, steps,
  } = await req.json()

  const prisma = await getPrisma()
  const rule = await prisma.$transaction(async (tx) => {
    await tx.approvalRule.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(minAmount != null && { minAmount: Number(minAmount) }),
        ...(maxAmount !== undefined && { maxAmount: maxAmount != null ? Number(maxAmount) : null }),
        ...(isManagerApprover !== undefined && { isManagerApprover: Boolean(isManagerApprover) }),
        ...(conditionType && { conditionType }),
        ...(percentageThreshold !== undefined && {
          percentageThreshold: percentageThreshold != null ? Number(percentageThreshold) : null,
        }),
        ...(specificApproverId !== undefined && { specificApproverId }),
      },
    })
    if (Array.isArray(steps)) {
      await tx.approvalStep.deleteMany({ where: { ruleId: id } })
      if (steps.length > 0) {
        await tx.approvalStep.createMany({
          data: steps.map((s: { approverId: string; sequence: number; label?: string }) => ({
            ruleId: id,
            approverId: s.approverId,
            sequence: s.sequence,
            label: s.label ?? null,
          })),
        })
      }
    }
    return tx.approvalRule.findUnique({
      where: { id },
      include: { steps: { orderBy: { sequence: 'asc' } } },
    })
  })

  return NextResponse.json(rule)
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await context.params
  const prisma = await getPrisma()
  await prisma.approvalRule.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

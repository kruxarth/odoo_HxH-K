import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPrisma } from '@/lib/prisma'
import { advanceApproval } from '@/lib/approval-engine'

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await context.params
  const { decision, comment } = await req.json()

  if (decision !== 'APPROVED' && decision !== 'REJECTED') {
    return NextResponse.json({ error: 'Invalid decision' }, { status: 400 })
  }

  const prisma = await getPrisma()
  const approval = await prisma.expenseApproval.findUnique({ where: { id } })
  if (!approval) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { id: userId, role } = session.user
  if (approval.approverId !== userId && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.expenseApproval.update({
    where: { id },
    data: { status: decision, comment: comment ?? null, decidedAt: new Date() },
  })

  await advanceApproval(approval.expenseId, prisma)

  return NextResponse.json({ ok: true })
}

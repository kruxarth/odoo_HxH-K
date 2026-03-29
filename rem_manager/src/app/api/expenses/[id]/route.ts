import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPrisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await context.params
  const { companyId } = session.user
  const prisma = await getPrisma()

  const expense = await prisma.expense.findFirst({
    where: { id, user: { companyId } },
    include: {
      user: { select: { name: true, email: true } },
      approvals: {
        include: { approver: { select: { name: true, email: true } } },
        orderBy: { sequence: 'asc' },
      },
    },
  })

  if (!expense) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(expense)
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await context.params
  const { status } = await req.json()
  const prisma = await getPrisma()

  const expense = await prisma.expense.update({
    where: { id },
    data: { status },
  })
  return NextResponse.json(expense)
}

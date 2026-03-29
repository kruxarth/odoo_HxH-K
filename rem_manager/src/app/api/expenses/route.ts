import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPrisma } from '@/lib/prisma'
import { convertCurrency } from '@/lib/currency'
import { resolveApprovalChain } from '@/lib/approval-engine'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: userId, role, companyId } = session.user
  const prisma = await getPrisma()

  let expenses

  if (role === 'EMPLOYEE') {
    expenses = await prisma.expense.findMany({
      where: { submitterId: userId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { submittedAt: 'desc' },
    })
  } else if (role === 'MANAGER') {
    expenses = await prisma.expense.findMany({
      where: {
        OR: [
          { submitterId: userId },
          { user: { managerId: userId } },
        ],
      },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { submittedAt: 'desc' },
    })
  } else {
    expenses = await prisma.expense.findMany({
      where: { user: { companyId } },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { submittedAt: 'desc' },
    })
  }

  return NextResponse.json(expenses)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: submitterId, companyId } = session.user
  const body = await req.json()
  const { title, amount, currency, category, description, date, receiptUrl } = body

  if (!title || !amount || !currency || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const prisma = await getPrisma()
  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 })

  const amountInCompanyCurrency = await convertCurrency(Number(amount), currency, company.currency)

  const submitter = await prisma.user.findUnique({ where: { id: submitterId } })
  if (!submitter) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const expense = await prisma.expense.create({
    data: {
      title,
      amount: Number(amount),
      currency,
      amountInCompanyCurrency,
      category,
      description: description ?? '',
      submitterId,
      companyId,
      receiptUrl: receiptUrl ?? null,
      submittedAt: date ? new Date(date) : new Date(),
    },
  })

  const rule = await prisma.approvalRule.findFirst({
    where: { companyId, minAmount: { lte: amountInCompanyCurrency } },
    include: { steps: { orderBy: { sequence: 'asc' } } },
    orderBy: { minAmount: 'desc' },
  })

  if (rule) {
    await resolveApprovalChain(expense.id, rule, submitter, prisma)
  }

  return NextResponse.json(expense, { status: 201 })
}

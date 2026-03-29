import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPrisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const prisma = await getPrisma()
  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
  })
  return NextResponse.json(company)
}

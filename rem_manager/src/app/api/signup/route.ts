import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getPrisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { name, email, password, companyName, country, currency } = await req.json()

  if (!name || !email || !password || !companyName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const prisma = await getPrisma()
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const company = await prisma.company.create({
    data: { name: companyName, country: country ?? 'US', currency: currency ?? 'USD' },
  })

  await prisma.user.create({
    data: { name, email, passwordHash, role: 'ADMIN', companyId: company.id },
  })

  return NextResponse.json({ ok: true })
}

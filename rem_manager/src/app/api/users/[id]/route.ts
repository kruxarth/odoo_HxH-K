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
  const { role, managerId } = await req.json()
  const prisma = await getPrisma()

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(role && { role }),
      ...(managerId !== undefined && { managerId: managerId ?? null }),
    },
    select: { id: true, name: true, email: true, role: true, managerId: true },
  })
  return NextResponse.json(user)
}

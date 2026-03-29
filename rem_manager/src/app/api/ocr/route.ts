import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { parseReceipt } from '@/lib/ocr'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('image') as File | null
  if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const result = await parseReceipt(buffer)
  return NextResponse.json(result)
}

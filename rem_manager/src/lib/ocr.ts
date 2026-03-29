import 'server-only'
import { createRequire } from 'node:module'

export interface OcrResult {
  amount?: string
  date?: string
  description?: string
}

const require = createRequire(import.meta.url)

export async function parseReceipt(imageBuffer: Buffer): Promise<OcrResult> {
  const Tesseract = require('tesseract.js') as typeof import('tesseract.js')
  const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
    logger: () => {},
  } as any)

  const amountMatch = text.match(/[$€£]?\s*\d{1,6}[.,]\d{2}/)
  const dateMatch = text.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/)

  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 5)
  const description = lines.find((l) => !/^\d/.test(l) && l.length > 5)

  return {
    amount: amountMatch?.[0]?.replace(/[^\d.,]/g, '').replace(',', '.'),
    date: dateMatch?.[0],
    description: description?.slice(0, 100),
  }
}

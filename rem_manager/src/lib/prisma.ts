import dns from 'dns'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

let _client: PrismaClient | null = null
let _initPromise: Promise<PrismaClient> | null = null

function resolveIPv4(hostname: string): Promise<string> {
  return new Promise((resolve, reject) =>
    dns.resolve4(hostname, (err, addrs) => {
      if (err || !addrs?.length) reject(err ?? new Error('No IPv4 address'))
      else resolve(addrs[0])
    })
  )
}

async function init(): Promise<PrismaClient> {
  const rawUrl = process.env.DATABASE_URL!
  const url = new URL(rawUrl)
  const hostname = url.hostname

  const ipv4 = await resolveIPv4(hostname)
  url.hostname = ipv4
  url.searchParams.delete('sslmode')
  url.searchParams.delete('channel_binding')

  const pool = new Pool({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false, servername: hostname },
  })
  const adapter = new PrismaPg(pool)
  const client = new PrismaClient({ adapter } as any)
  _client = client
  return client
}

export async function getPrisma(): Promise<PrismaClient> {
  if (_client) return _client
  if (!_initPromise) _initPromise = init()
  return _initPromise
}

// Convenience re-export for server components that can await at the top
export { type PrismaClient }

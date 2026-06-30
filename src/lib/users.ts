import bcrypt from 'bcryptjs'
import { getPrisma } from './db'
import { nameFromEmail } from './auth'

export function isDbEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

export interface PublicUser {
  email: string
  name: string
}

/** Create a user with a hashed password. Throws 'EXISTS' if the email is taken. */
export async function createUser(name: string, email: string, password: string): Promise<PublicUser> {
  const prisma = getPrisma()
  if (!prisma) throw new Error('NO_DB')
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('EXISTS')
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, name: name.trim() || nameFromEmail(email), password: hash },
  })
  return { email: user.email, name: user.name }
}

/** Verify credentials. Returns the user on success, null on failure. */
export async function authenticate(email: string, password: string): Promise<PublicUser | null> {
  const prisma = getPrisma()
  if (!prisma) return null
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return null
  return { email: user.email, name: user.name }
}

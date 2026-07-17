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

/** Fetch a user's public fields by email. */
export async function getPublicUser(email: string): Promise<PublicUser | null> {
  const prisma = getPrisma()
  if (!prisma) return null
  const u = await prisma.user.findUnique({ where: { email }, select: { email: true, name: true } }).catch(() => null)
  return u ? { email: u.email, name: u.name } : null
}

/** Whether an account exists for this email. */
export async function userExists(email: string): Promise<boolean> {
  const prisma = getPrisma()
  if (!prisma) return false
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } }).catch(() => null)
  return Boolean(user)
}

/** Set a new hashed password. Returns false if no such user / no DB. */
export async function setPassword(email: string, password: string): Promise<boolean> {
  const prisma = getPrisma()
  if (!prisma) return false
  const hash = await bcrypt.hash(password, 10)
  const r = await prisma.user.updateMany({ where: { email }, data: { password: hash } }).catch(() => ({ count: 0 }))
  return r.count > 0
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

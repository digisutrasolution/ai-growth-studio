import { PrismaClient } from '@prisma/client'

/**
 * Lazy Prisma singleton. Returns null when DATABASE_URL is not configured, so
 * the app runs in demo mode (no database) without ever constructing a client.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }
  return globalForPrisma.prisma
}

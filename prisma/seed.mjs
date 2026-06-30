// Seeds the demo account so "Continue with demo account" works in DB mode.
// Run after `npm run db:push`:  npm run db:seed
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const email = 'demo@digisutra.studio'
const password = await bcrypt.hash('demo-access', 10)

const user = await prisma.user.upsert({
  where: { email },
  update: {},
  create: { email, name: 'Demo', password },
})

console.log('✓ Seeded demo user:', user.email)
await prisma.$disconnect()

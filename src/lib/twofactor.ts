import { authenticator } from 'otplib'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { getPrisma } from './db'

const ISSUER = 'DigiSutra'

// Allow one step (±30s) of clock drift.
authenticator.options = { window: 1 }

export function generateSecret(): string {
  return authenticator.generateSecret()
}

export function keyuri(email: string, secret: string): string {
  return authenticator.keyuri(email, ISSUER, secret)
}

export function verifyToken(secret: string, token: string): boolean {
  try {
    return authenticator.check(token.replace(/\s/g, ''), secret)
  } catch {
    return false
  }
}

/** 8 human-friendly one-time backup codes (plaintext, shown once). */
export function generateBackupCodes(count = 8): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(5).toString('hex') // 10 hex chars
    codes.push(`${raw.slice(0, 5)}-${raw.slice(5)}`)
  }
  return codes
}

async function hashCodes(codes: string[]): Promise<string> {
  const hashed = await Promise.all(codes.map((c) => bcrypt.hash(c, 10)))
  return JSON.stringify(hashed)
}

export interface TwoFactorState {
  enabled: boolean
  hasSecret: boolean
}

export async function getTwoFactor(email: string): Promise<TwoFactorState> {
  const prisma = getPrisma()
  if (!prisma) return { enabled: false, hasSecret: false }
  const u = await prisma.user
    .findUnique({ where: { email }, select: { twoFactorEnabled: true, twoFactorSecret: true } })
    .catch(() => null)
  return { enabled: Boolean(u?.twoFactorEnabled), hasSecret: Boolean(u?.twoFactorSecret) }
}

/** True only when the account has 2FA switched on. */
export async function isTwoFactorEnabled(email: string): Promise<boolean> {
  return (await getTwoFactor(email)).enabled
}

/** Store a freshly-generated secret (not yet enabled). */
export async function stageSecret(email: string, secret: string): Promise<boolean> {
  const prisma = getPrisma()
  if (!prisma) return false
  const r = await prisma.user
    .updateMany({ where: { email }, data: { twoFactorSecret: secret, twoFactorEnabled: false } })
    .catch(() => ({ count: 0 }))
  return r.count > 0
}

/** Confirm the staged secret with a valid code, enable 2FA, return backup codes. */
export async function enableTwoFactor(email: string, code: string): Promise<{ ok: boolean; backupCodes?: string[] }> {
  const prisma = getPrisma()
  if (!prisma) return { ok: false }
  const u = await prisma.user.findUnique({ where: { email }, select: { twoFactorSecret: true } }).catch(() => null)
  if (!u?.twoFactorSecret) return { ok: false }
  if (!verifyToken(u.twoFactorSecret, code)) return { ok: false }
  const backupCodes = generateBackupCodes()
  await prisma.user.update({
    where: { email },
    data: { twoFactorEnabled: true, backupCodes: await hashCodes(backupCodes) },
  })
  return { ok: true, backupCodes }
}

/** Verify a login-time factor: a TOTP code OR a one-time backup code (consumed). */
export async function verifyTwoFactor(email: string, code: string): Promise<boolean> {
  const prisma = getPrisma()
  if (!prisma) return false
  const u = await prisma.user
    .findUnique({ where: { email }, select: { twoFactorSecret: true, twoFactorEnabled: true, backupCodes: true } })
    .catch(() => null)
  if (!u?.twoFactorEnabled || !u.twoFactorSecret) return false

  const clean = code.replace(/\s/g, '')
  if (verifyToken(u.twoFactorSecret, clean)) return true

  // Fall back to backup codes.
  if (u.backupCodes) {
    const hashes: string[] = JSON.parse(u.backupCodes)
    for (let i = 0; i < hashes.length; i++) {
      if (await bcrypt.compare(clean, hashes[i])) {
        hashes.splice(i, 1) // consume it
        await prisma.user.update({ where: { email }, data: { backupCodes: JSON.stringify(hashes) } }).catch(() => {})
        return true
      }
    }
  }
  return false
}

/** Turn 2FA off after verifying a current code (or backup code). */
export async function disableTwoFactor(email: string, code: string): Promise<boolean> {
  const prisma = getPrisma()
  if (!prisma) return false
  const ok = await verifyTwoFactor(email, code)
  if (!ok) return false
  await prisma.user.update({ where: { email }, data: { twoFactorEnabled: false, twoFactorSecret: null, backupCodes: null } })
  return true
}

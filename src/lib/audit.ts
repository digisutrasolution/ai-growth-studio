import { getPrisma } from './db'

export interface AuditEntry {
  actor: string
  action: string
  target?: string | null
  detail?: string | null
  ip?: string | null
}

/** Record an audit entry (best-effort — never throws, no-op without a DB). */
export async function logAudit(entry: AuditEntry): Promise<void> {
  const prisma = getPrisma()
  if (!prisma) return
  await prisma.auditLog
    .create({ data: { actor: entry.actor, action: entry.action, target: entry.target ?? null, detail: entry.detail ?? null, ip: entry.ip ?? null } })
    .catch(() => {})
}

export interface AuditRow {
  actor: string
  action: string
  target: string | null
  detail: string | null
  ip: string | null
  createdAt: string
}

export async function getAuditLogs(limit = 100): Promise<AuditRow[]> {
  const prisma = getPrisma()
  if (!prisma) return []
  const rows = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: limit }).catch(() => [])
  return rows.map((r) => ({
    actor: r.actor,
    action: r.action,
    target: r.target,
    detail: r.detail,
    ip: r.ip,
    createdAt: r.createdAt.toISOString(),
  }))
}

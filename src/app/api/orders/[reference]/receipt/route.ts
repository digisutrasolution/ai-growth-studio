import { cookies } from 'next/headers'
import { SESSION_COOKIE, readSession } from '@/lib/auth'
import { getOrder } from '@/lib/billing-store'

export const runtime = 'nodejs'

const SYM: Record<string, string> = { USD: '$', INR: '₹' }
const METHOD: Record<string, string> = {
  paypal: 'PayPal', cashfree: 'Cashfree', crypto: 'Crypto', bank_transfer: 'Bank transfer',
}
const appUrl = process.env.APP_URL || 'https://digisutra.solutions'

const money = (minor: number, currency: string) =>
  `${SYM[currency] ?? ''}${(minor / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}`

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))

export async function GET(_req: Request, ctx: { params: Promise<{ reference: string }> }) {
  const { reference } = await ctx.params

  const store = await cookies()
  const session = await readSession(store.get(SESSION_COOKIE)?.value)
  if (!session?.email) {
    return new Response('Please sign in to view this receipt.', { status: 401 })
  }

  const order = await getOrder(reference)
  if (!order) return new Response('Receipt not found.', { status: 404 })
  // Only the buyer may view their own receipt.
  if (order.email.toLowerCase() !== session.email.toLowerCase()) {
    return new Response('Not authorized to view this receipt.', { status: 403 })
  }

  const paid = order.status === 'paid'
  const statusColor = paid ? '#0ea472' : order.status === 'failed' ? '#dc2626' : '#d97706'
  const dateLine = order.paidAt ? fmtDate(order.paidAt) : fmtDate(order.createdAt)

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Receipt ${esc(order.reference)} — DigiSutra</title>
<style>
  :root { color-scheme: light }
  * { box-sizing: border-box }
  body { margin:0; background:#f4f4f7; color:#1a1a24; font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; padding:32px 16px }
  .sheet { max-width:640px; margin:0 auto; background:#fff; border:1px solid #e6e6ee; border-radius:16px; overflow:hidden }
  .head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; padding:28px 32px; border-bottom:1px solid #eee }
  .brand { font-size:12px; letter-spacing:.1em; text-transform:uppercase; color:#7c5cff; font-weight:700 }
  .brand h1 { margin:6px 0 0; font-size:20px; color:#111 }
  .badge { font-size:12px; font-weight:700; text-transform:capitalize; padding:6px 12px; border-radius:999px; color:#fff }
  .meta { padding:24px 32px; display:grid; grid-template-columns:1fr 1fr; gap:16px 24px; font-size:14px }
  .meta .k { color:#8a8a9c; font-size:12px; text-transform:uppercase; letter-spacing:.05em }
  .meta .v { margin-top:2px; font-weight:600 }
  table { width:100%; border-collapse:collapse; margin-top:8px }
  thead th { text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:#8a8a9c; padding:12px 32px; border-top:1px solid #eee; border-bottom:1px solid #eee }
  thead th:last-child, td:last-child { text-align:right }
  tbody td { padding:16px 32px; font-size:15px }
  .total { display:flex; justify-content:space-between; padding:16px 32px; border-top:2px solid #eee; font-size:18px; font-weight:700 }
  .foot { padding:20px 32px; border-top:1px solid #eee; font-size:12px; color:#8a8a9c; line-height:1.6 }
  .actions { max-width:640px; margin:16px auto 0; text-align:right }
  .btn { display:inline-block; background:linear-gradient(135deg,#7c5cff,#4a9dff); color:#fff; border:none; font:inherit; font-weight:600; font-size:14px; padding:11px 20px; border-radius:10px; cursor:pointer }
  .mono { font-family:ui-monospace,SFMono-Regular,Menlo,monospace }
  @media print { body { background:#fff; padding:0 } .sheet { border:none; border-radius:0 } .actions { display:none } }
</style></head>
<body>
  <div class="sheet">
    <div class="head">
      <div class="brand">DigiSutra Solutions<h1>Receipt</h1></div>
      <span class="badge" style="background:${statusColor}">${esc(order.status)}</span>
    </div>
    <div class="meta">
      <div><div class="k">Receipt no.</div><div class="v mono">${esc(order.reference)}</div></div>
      <div><div class="k">Date</div><div class="v">${dateLine}</div></div>
      <div><div class="k">Billed to</div><div class="v">${esc(order.email)}</div></div>
      <div><div class="k">Payment method</div><div class="v">${esc(METHOD[order.method] ?? order.method)}</div></div>
    </div>
    <table>
      <thead><tr><th>Description</th><th>Amount</th></tr></thead>
      <tbody><tr>
        <td><strong>${esc(order.plan)} plan</strong><br><span style="color:#8a8a9c;font-size:13px;text-transform:capitalize">Billed ${esc(order.cycle)}</span></td>
        <td class="mono">${money(order.amount, order.currency)}</td>
      </tr></tbody>
    </table>
    <div class="total"><span>Total ${paid ? 'paid' : 'due'}</span><span class="mono">${money(order.amount, order.currency)} ${esc(order.currency)}</span></div>
    <div class="foot">
      DigiSutra Solutions — AI Growth Studio · ${appUrl}<br>
      ${paid ? 'Thank you for your payment. This receipt confirms your subscription is active.' : 'This order is not yet settled. It will be confirmed once payment clears.'}
    </div>
  </div>
  <div class="actions"><button class="btn" onclick="window.print()">Download / Print PDF</button></div>
</body></html>`

  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' },
  })
}

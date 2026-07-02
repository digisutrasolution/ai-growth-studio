import nodemailer from 'nodemailer'

const HOST = process.env.SMTP_HOST
const PORT = Number(process.env.SMTP_PORT || 587)
const USER = process.env.SMTP_USER
const PASS = process.env.SMTP_PASS
const FROM = process.env.SMTP_FROM || 'DigiSutra Solutions <billing@digisutra.solutions>'
const appUrl = process.env.APP_URL || 'https://digisutra.solutions'

export function isEmailEnabled(): boolean {
  return Boolean(HOST && USER && PASS)
}

let transport: nodemailer.Transporter | null = null
function getTransport() {
  if (!isEmailEnabled()) return null
  if (!transport) {
    transport = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465, // implicit TLS on 465, STARTTLS otherwise
      auth: { user: USER, pass: PASS },
    })
  }
  return transport
}

/** Send an email. No-op (logs) when SMTP isn't configured, so the app stays demo-safe. */
export async function sendMail(opts: { to: string; subject: string; html: string; text?: string }) {
  const t = getTransport()
  if (!t) {
    console.log(`[email] SMTP not configured — skipped "${opts.subject}" to ${opts.to}`)
    return { sent: false }
  }
  try {
    await t.sendMail({ from: FROM, ...opts })
    return { sent: true }
  } catch (err) {
    console.error('[email] send failed:', err)
    return { sent: false }
  }
}

export interface PlanEmailData {
  to: string
  plan: string
  cycle: string
  reference: string
  amount: number // minor units
  currency: string
  method: string
}

const SYM: Record<string, string> = { USD: '$', INR: '₹' }
const METHOD: Record<string, string> = {
  paypal: 'PayPal', cashfree: 'Cashfree', crypto: 'Crypto', bank_transfer: 'Bank transfer',
}

function money(amountMinor: number, currency: string) {
  return `${SYM[currency] ?? ''}${(amountMinor / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

/** Confirmation email sent when a plan is activated after a paid order. */
export async function sendPlanActivatedEmail(d: PlanEmailData) {
  const receiptUrl = `${appUrl}/api/orders/${encodeURIComponent(d.reference)}/receipt`
  const html = `
  <div style="margin:0;padding:24px;background:#0b0b12;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#e7e7ee">
    <div style="max-width:520px;margin:0 auto;background:#14141d;border:1px solid #26263a;border-radius:20px;overflow:hidden">
      <div style="padding:28px 28px 20px;border-bottom:1px solid #26263a">
        <p style="margin:0;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#8a8aa8">DigiSutra Solutions</p>
        <h1 style="margin:10px 0 0;font-size:22px;color:#fff">Your ${d.plan} plan is active 🎉</h1>
      </div>
      <div style="padding:24px 28px">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#c4c4d6">
          Thanks for your payment — your subscription is now live. Here are the details:
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#8a8aa8">Plan</td><td style="padding:8px 0;text-align:right;color:#fff;font-weight:600">${d.plan} · ${d.cycle}</td></tr>
          <tr><td style="padding:8px 0;color:#8a8aa8">Amount</td><td style="padding:8px 0;text-align:right;color:#fff;font-weight:600">${money(d.amount, d.currency)}</td></tr>
          <tr><td style="padding:8px 0;color:#8a8aa8">Method</td><td style="padding:8px 0;text-align:right;color:#e7e7ee">${METHOD[d.method] ?? d.method}</td></tr>
          <tr><td style="padding:8px 0;color:#8a8aa8">Reference</td><td style="padding:8px 0;text-align:right;color:#e7e7ee;font-family:monospace">${d.reference}</td></tr>
        </table>
        <div style="margin-top:24px">
          <a href="${receiptUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c5cff,#4a9dff);color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:12px">Download receipt</a>
          <a href="${appUrl}/dashboard/billing" style="display:inline-block;margin-left:8px;color:#a9a9c4;text-decoration:none;font-size:14px;padding:12px 10px">Go to billing</a>
        </div>
      </div>
      <div style="padding:18px 28px;border-top:1px solid #26263a;font-size:12px;color:#6f6f8c">
        DigiSutra Solutions · This is a payment confirmation for ${d.to}.
      </div>
    </div>
  </div>`
  const text = `Your ${d.plan} plan is active.\nAmount: ${money(d.amount, d.currency)} (${d.cycle})\nMethod: ${METHOD[d.method] ?? d.method}\nReference: ${d.reference}\nReceipt: ${receiptUrl}\nBilling: ${appUrl}/dashboard/billing`
  return sendMail({ to: d.to, subject: `Your ${d.plan} plan is active — DigiSutra`, html, text })
}

/** Shared branded shell for lifecycle emails. */
function shell(heading: string, bodyHtml: string, cta: { label: string; url: string }, footer: string) {
  return `
  <div style="margin:0;padding:24px;background:#0b0b12;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#e7e7ee">
    <div style="max-width:520px;margin:0 auto;background:#14141d;border:1px solid #26263a;border-radius:20px;overflow:hidden">
      <div style="padding:28px 28px 20px;border-bottom:1px solid #26263a">
        <p style="margin:0;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#8a8aa8">DigiSutra Solutions</p>
        <h1 style="margin:10px 0 0;font-size:22px;color:#fff">${heading}</h1>
      </div>
      <div style="padding:24px 28px;font-size:15px;line-height:1.6;color:#c4c4d6">
        ${bodyHtml}
        <div style="margin-top:24px">
          <a href="${cta.url}" style="display:inline-block;background:linear-gradient(135deg,#7c5cff,#4a9dff);color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:12px">${cta.label}</a>
        </div>
      </div>
      <div style="padding:18px 28px;border-top:1px solid #26263a;font-size:12px;color:#6f6f8c">${footer}</div>
    </div>
  </div>`
}

const fmtDay = (d: Date) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })

/** Sent when a subscription period ends and payment is due. */
export async function sendRenewalDueEmail(o: {
  to: string; plan: string; cycle: string; amount: number; currency: string; graceEnd: Date
}) {
  const billing = `${appUrl}/dashboard/billing`
  const body = `
    <p style="margin:0 0 12px">Your <strong>${o.plan}</strong> plan (${o.cycle}) is due for renewal. To keep your subscription active, please complete payment of <strong>${money(o.amount, o.currency)}</strong>.</p>
    <p style="margin:0;color:#8a8aa8;font-size:13px">If we don't receive payment by ${fmtDay(o.graceEnd)}, your plan will be downgraded to Free.</p>`
  return sendMail({
    to: o.to, subject: `Action needed: renew your ${o.plan} plan — DigiSutra`,
    html: shell('Time to renew your plan', body, { label: 'Renew now', url: billing },
      `Renewal notice for ${o.to}. Pay via card, PayPal, UPI/Cashfree, crypto or bank transfer.`),
    text: `Your ${o.plan} plan is due for renewal (${money(o.amount, o.currency)}). Renew at ${billing} by ${fmtDay(o.graceEnd)} to avoid downgrade.`,
  })
}

/** Reminder while a subscription is past due (dunning). */
export async function sendDunningEmail(o: {
  to: string; plan: string; amount: number; currency: string; graceEnd: Date
}) {
  const billing = `${appUrl}/dashboard/billing`
  const body = `
    <p style="margin:0 0 12px">We still haven't received payment for your <strong>${o.plan}</strong> plan. Your subscription is <strong style="color:#f59e0b">past due</strong>.</p>
    <p style="margin:0;color:#8a8aa8;font-size:13px">Renew before ${fmtDay(o.graceEnd)} to avoid losing access. Amount due: ${money(o.amount, o.currency)}.</p>`
  return sendMail({
    to: o.to, subject: `Reminder: your ${o.plan} plan is past due — DigiSutra`,
    html: shell('Your plan is past due', body, { label: 'Complete payment', url: billing },
      `Payment reminder for ${o.to}.`),
    text: `Reminder: your ${o.plan} plan is past due (${money(o.amount, o.currency)}). Renew at ${billing} before ${fmtDay(o.graceEnd)}.`,
  })
}

/** Sent when a subscription is canceled (non-payment or by request). */
export async function sendSubscriptionCanceledEmail(o: { to: string; plan: string; reason: 'nonpayment' | 'requested' }) {
  const billing = `${appUrl}/dashboard/billing`
  const body = o.reason === 'nonpayment'
    ? `<p style="margin:0">Your <strong>${o.plan}</strong> plan has been downgraded to Free because payment wasn't received in time. You can re-subscribe anytime.</p>`
    : `<p style="margin:0">Your <strong>${o.plan}</strong> plan has been canceled and won't renew. You'll keep access until the end of your current period.</p>`
  return sendMail({
    to: o.to, subject: `Your ${o.plan} subscription has ${o.reason === 'nonpayment' ? 'ended' : 'been canceled'} — DigiSutra`,
    html: shell(o.reason === 'nonpayment' ? 'Subscription ended' : 'Subscription canceled', body,
      { label: 'Re-subscribe', url: billing }, `Account update for ${o.to}.`),
    text: `Your ${o.plan} subscription has ${o.reason === 'nonpayment' ? 'ended (non-payment)' : 'been canceled'}. Re-subscribe at ${billing}.`,
  })
}

import { plans, planPriceInr } from './data'

export type Currency = 'USD' | 'INR'
export type Cycle = 'monthly' | 'yearly'
export type MethodId = 'paypal' | 'crypto' | 'cashfree' | 'bank_transfer'

export interface PaymentMethod {
  id: MethodId
  label: string
  blurb: string
  currencies: Currency[]
  /** lucide icon name, resolved in the UI */
  icon: 'Landmark' | 'Wallet' | 'Bitcoin' | 'Banknote'
}

/** Region-aware method catalog. Bank transfer works everywhere with no keys. */
export const paymentMethods: PaymentMethod[] = [
  { id: 'paypal', label: 'PayPal', blurb: 'Cards & PayPal balance', currencies: ['USD'], icon: 'Wallet' },
  { id: 'crypto', label: 'Crypto', blurb: 'USDT, BTC, ETH & more', currencies: ['USD'], icon: 'Bitcoin' },
  { id: 'cashfree', label: 'Cashfree', blurb: 'UPI, cards, netbanking', currencies: ['INR'], icon: 'Landmark' },
  { id: 'bank_transfer', label: 'Bank Transfer', blurb: 'Manual wire / NEFT', currencies: ['USD', 'INR'], icon: 'Banknote' },
]

export function methodsForCurrency(currency: Currency): PaymentMethod[] {
  return paymentMethods.filter((m) => m.currencies.includes(currency))
}

/** Whether a gateway has its credentials configured (server-side only). */
export function isMethodConfigured(id: MethodId): boolean {
  switch (id) {
    case 'paypal':
      return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)
    case 'cashfree':
      return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY)
    case 'crypto':
      return Boolean(process.env.NOWPAYMENTS_API_KEY)
    case 'bank_transfer':
      return true // always available — no external gateway
  }
}

export const currencySymbol: Record<Currency, string> = { USD: '$', INR: '₹' }

/** Price in whole currency units for a plan (0 = custom/Enterprise). */
export function planPrice(planName: string, currency: Currency, cycle: Cycle): number {
  const plan = plans.find((p) => p.name === planName)
  if (!plan) return 0
  if (currency === 'INR') return planPriceInr[planName]?.[cycle] ?? 0
  return cycle === 'monthly' ? plan.monthly : plan.yearly
}

/** Smallest unit (cents / paise) — what gateways expect. */
export function amountMinor(planName: string, currency: Currency, cycle: Cycle): number {
  return Math.round(planPrice(planName, currency, cycle) * 100)
}

export function formatPrice(planName: string, currency: Currency, cycle: Cycle): string {
  const v = planPrice(planName, currency, cycle)
  return `${currencySymbol[currency]}${v.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US')}`
}

/** Manual bank details, sourced from env with safe placeholders. */
export function bankDetails(currency: Currency): { label: string; value: string }[] {
  if (currency === 'INR') {
    return [
      { label: 'Account name', value: process.env.BANK_INR_NAME || 'DigiSutra Solutions' },
      { label: 'Account no.', value: process.env.BANK_INR_ACCOUNT || 'XXXXXXXXXXXX' },
      { label: 'IFSC', value: process.env.BANK_INR_IFSC || 'XXXX0000000' },
      { label: 'Bank', value: process.env.BANK_INR_BANK || 'Your Bank, India' },
      { label: 'UPI', value: process.env.BANK_INR_UPI || 'digisutra@upi' },
    ]
  }
  return [
    { label: 'Beneficiary', value: process.env.BANK_USD_NAME || 'DigiSutra Solutions' },
    { label: 'Account no.', value: process.env.BANK_USD_ACCOUNT || 'XXXXXXXXXX' },
    { label: 'SWIFT/BIC', value: process.env.BANK_USD_SWIFT || 'XXXXXXXX' },
    { label: 'Bank', value: process.env.BANK_USD_BANK || 'Your Bank' },
    { label: 'Routing', value: process.env.BANK_USD_ROUTING || 'XXXXXXXXX' },
  ]
}

export function newReference(): string {
  return 'AGS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
}

export const appUrl = process.env.APP_URL || 'https://digisutra.solutions'

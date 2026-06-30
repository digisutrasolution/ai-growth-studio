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

export interface BankField { label: string; value: string }
export interface BankAccount { title: string; region: string; note?: string; fields: BankField[] }

const env = (key: string, fallback = '—') => process.env[key] || fallback

/**
 * Manual bank-transfer accounts per currency, sourced from env so the real
 * account numbers stay out of the (public) repo. USD shows a US-domestic ACH
 * option plus an international SWIFT/IBAN wire; INR shows the Indian account.
 */
export function bankAccounts(currency: Currency): BankAccount[] {
  if (currency === 'INR') {
    return [
      {
        title: 'India — bank transfer',
        region: 'India · INR',
        fields: [
          { label: 'Account name', value: env('BANK_IN_NAME', 'DigiSutra Solutions') },
          { label: 'Account no.', value: env('BANK_IN_ACCOUNT') },
          { label: 'IFSC', value: env('BANK_IN_IFSC') },
          { label: 'SWIFT', value: env('BANK_IN_SWIFT') },
          { label: 'Bank', value: env('BANK_IN_BANK', 'Axis Bank') },
          { label: 'Branch', value: env('BANK_IN_BRANCH') },
          { label: 'Account type', value: env('BANK_IN_TYPE', 'Current') },
        ],
      },
    ]
  }
  return [
    {
      title: 'USA — ACH transfer',
      region: 'United States · USD',
      fields: [
        { label: 'Account name', value: env('BANK_US_NAME', 'DigiSutra Solutions') },
        { label: 'Account no.', value: env('BANK_US_ACCOUNT') },
        { label: 'ACH routing', value: env('BANK_US_ROUTING') },
        { label: 'Bank', value: env('BANK_US_BANK') },
        { label: 'Bank address', value: env('BANK_US_ADDRESS') },
        { label: 'Currency', value: 'USD' },
      ],
    },
    {
      title: 'International — SWIFT / IBAN wire',
      region: 'All countries',
      note: env('BANK_INTL_NOTE', 'When initiating the transfer, add the remark: DO NOT CONVERT TO GBP'),
      fields: [
        { label: 'Account name', value: env('BANK_INTL_NAME', 'DigiSutra Solutions') },
        { label: 'IBAN (account no.)', value: env('BANK_INTL_IBAN') },
        { label: 'BIC / SWIFT', value: env('BANK_INTL_SWIFT') },
        { label: 'Bank', value: env('BANK_INTL_BANK') },
        { label: 'Bank address', value: env('BANK_INTL_ADDRESS') },
      ],
    },
  ]
}

export function newReference(): string {
  return 'AGS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
}

export const appUrl = process.env.APP_URL || 'https://digisutra.solutions'

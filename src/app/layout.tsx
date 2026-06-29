import type { Metadata, Viewport } from 'next'
import { Sora, Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AIAssistant } from '@/components/assistant/ai-assistant'

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const siteUrl = 'https://aigrowth.studio'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AI Growth Studio — AI-Powered Digital Marketing Automation',
    template: '%s · AI Growth Studio',
  },
  description:
    'AI agents that manage campaigns, analyze data, generate content, optimize ads, and automate customer engagement. Grow your business with intelligent marketing automation.',
  keywords: ['AI marketing', 'marketing automation', 'AI agents', 'digital marketing', 'SEO AI', 'ad optimization', 'SaaS'],
  authors: [{ name: 'Steven' }],
  openGraph: {
    title: 'AI Growth Studio — AI-Powered Digital Marketing Automation',
    description: 'AI agents that run your campaigns, analytics, content and customer engagement on autopilot.',
    url: siteUrl,
    siteName: 'AI Growth Studio',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'AI Growth Studio', description: 'AI-powered digital marketing automation.' },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f7fc' },
    { media: '(prefers-color-scheme: dark)', color: '#07080f' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${inter.variable}`}>
      <body className="min-h-dvh antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <AIAssistant />
        </ThemeProvider>
      </body>
    </html>
  )
}

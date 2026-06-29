import { NextResponse } from 'next/server'
import { generate, type ChatMsg } from '@/lib/ai'

// The Anthropic SDK needs the Node.js runtime (not edge).
export const runtime = 'nodejs'

const SYSTEM_PROMPT = `You are Nova, the AI growth assistant inside DigiSutra's AI Growth Studio — an AI-powered digital marketing platform.
Help users grow their business across campaigns, SEO, content, lead generation, analytics, and automation.
Style: respond directly with no preamble (don't open with "Sure" or "Here is"). Be concise and actionable — give a direct answer or 2–4 concrete steps, generally under ~120 words unless the user asks for depth.
When a request maps to an action, describe what you'd set up and which of the platform's agents would run it (Marketing, SEO, Content, Sales, or Customer Support).`

type ClientMsg = { role: 'user' | 'ai'; text: string }

/* Canned fallback used when no API key is configured (demo mode). */
function cannedReply(input: string): string {
  const q = input.toLowerCase()
  if (q.includes('traffic'))
    return 'Analyzing your website… Here are 5 quick wins: target 38 high-intent keywords, fix broken links, speed up LCP, add internal link clusters, and refresh stale posts. Want me to queue these for the SEO agent?'
  if (q.includes('email'))
    return "I'd draft a 3-email launch sequence with subject lines, preview text, and CTAs — projected ~41% open rate for your list. Want me to schedule it?"
  if (q.includes('seo') || q.includes('audit'))
    return 'Running a quick audit… Technical score ~82/100. Top wins: compress images, add schema to key templates, and fix redirect chains. I can apply the safe fixes automatically.'
  return "Here's what I'd do: 1) tighten your top 3 audiences, 2) shift budget to your best-performing channel, 3) ship 2 fresh creatives. Want me to set this up as an automation?"
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { messages?: ClientMsg[] }
  const incoming = Array.isArray(body.messages) ? body.messages : []
  const lastUser = [...incoming].reverse().find((m) => m.role === 'user')?.text ?? ''

  const mapped: ChatMsg[] = incoming.map((m) => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.text,
  }))

  try {
    const reply = await generate(SYSTEM_PROMPT, mapped)
    if (reply) return NextResponse.json({ reply })
    // No provider configured → demo mode.
    return NextResponse.json({ reply: cannedReply(lastUser), demo: true })
  } catch (err) {
    console.error('[assistant] generation failed:', err)
    // Graceful degradation rather than a hard error in the chat UI.
    return NextResponse.json({ reply: cannedReply(lastUser), demo: true }, { status: 200 })
  }
}

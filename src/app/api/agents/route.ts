import { NextResponse } from 'next/server'
import { generate } from '@/lib/ai'

export const runtime = 'nodejs'

type AgentId = 'marketing' | 'seo' | 'content' | 'sales' | 'support'

const AGENTS: Record<AgentId, { name: string; system: string; task: string; canned: string }> = {
  marketing: {
    name: 'Marketing AI Agent',
    system: 'You are an expert performance-marketing strategist. Be concrete, prioritized, and channel-aware. No preamble.',
    task: 'Give 4 high-impact growth ideas for this week as a numbered list. Each: a one-line action plus the expected effect.',
    canned: '1. Shift 15% budget to your lowest-CPA channel.\n2. Launch a lookalike audience from your top 1% customers.\n3. A/B test 2 new hooks on your best ad.\n4. Add a retargeting flow for cart abandoners.',
  },
  seo: {
    name: 'SEO AI Agent',
    system: 'You are an expert technical + content SEO. Be specific and prioritized by impact/effort. No preamble.',
    task: 'List 4 prioritized SEO wins for this week as a numbered list, each with the action and why it matters.',
    canned: '1. Fix broken internal links (quick crawl win).\n2. Add schema to your top 10 templates.\n3. Target 5 high-intent, low-difficulty keywords.\n4. Improve LCP on your top landing page.',
  },
  content: {
    name: 'Content AI Agent',
    system: 'You are an expert content strategist and copywriter. Be on-brand, specific, and actionable. No preamble.',
    task: 'Propose 4 content pieces to publish this week as a numbered list, each with a title and the channel.',
    canned: '1. "5 automations that 10x your pipeline" — blog.\n2. Carousel: before/after of an AI campaign — LinkedIn.\n3. Launch email: new feature spotlight.\n4. Short demo video script — TikTok/Reels.',
  },
  sales: {
    name: 'Sales AI Agent',
    system: 'You are an expert revenue/sales-ops strategist. Be concrete about lead handling and follow-ups. No preamble.',
    task: 'List 4 sales actions for this week as a numbered list, each with the action and expected result.',
    canned: '1. Re-engage 3 stalled Proposal-stage leads.\n2. Auto-route hot leads (score > 80) to reps instantly.\n3. Send a personalized win-back to dormant accounts.\n4. Clean up duplicate CRM records.',
  },
  support: {
    name: 'Customer Support AI Agent',
    system: 'You are an expert CX/support-automation strategist. Be specific about deflection and satisfaction. No preamble.',
    task: 'List 4 support improvements for this week as a numbered list, each with the action and the benefit.',
    canned: '1. Auto-answer top 10 FAQs from your knowledge base.\n2. Add a CSAT prompt after each resolution.\n3. Triage tickets by urgency automatically.\n4. Escalate only when confidence is low.',
  },
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { agentId?: AgentId; prompt?: string }
  const agent = body.agentId && AGENTS[body.agentId]
  if (!agent) return NextResponse.json({ error: 'Unknown agent' }, { status: 400 })

  const userPrompt = body.prompt?.trim() || agent.task

  try {
    const reply = await generate(agent.system, [{ role: 'user', content: userPrompt }], 700)
    if (reply) return NextResponse.json({ reply })
    return NextResponse.json({ reply: agent.canned, demo: true })
  } catch (err) {
    console.error('[agents] generation failed:', err)
    return NextResponse.json({ reply: agent.canned, demo: true }, { status: 200 })
  }
}

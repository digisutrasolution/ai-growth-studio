import Anthropic from '@anthropic-ai/sdk'

export type ChatMsg = { role: 'user' | 'assistant'; content: string }

/**
 * Provider-agnostic text generation for the Nova assistant and AI agents.
 * Picks Claude (via the official @anthropic-ai/sdk) when ANTHROPIC_API_KEY is set,
 * otherwise OpenAI (real OpenAI REST API) when OPENAI_API_KEY is set.
 * Returns null when no provider is configured — callers fall back to canned demo text.
 */
export async function generate(system: string, messages: ChatMsg[], maxTokens = 1024): Promise<string | null> {
  // The Messages API requires the conversation to start with a user turn.
  const msgs = [...messages]
  while (msgs.length && msgs[0].role !== 'user') msgs.shift()
  if (msgs.length === 0) return null

  // Preferred: Claude via the official SDK.
  if (process.env.ANTHROPIC_API_KEY) {
    const client = new Anthropic()
    const res = await client.messages.create({
      model: process.env.CHAT_MODEL || 'claude-opus-4-8',
      max_tokens: maxTokens,
      system,
      messages: msgs,
    })
    return res.content.find((b) => b.type === 'text')?.text?.trim() || null
  }

  // Alternative: OpenAI (honors the original spec). Uses the real OpenAI API.
  if (process.env.OPENAI_API_KEY) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        max_tokens: maxTokens,
        messages: [{ role: 'system', content: system }, ...msgs],
      }),
    })
    if (!res.ok) throw new Error(`OpenAI request failed: ${res.status}`)
    const data = await res.json()
    return (data.choices?.[0]?.message?.content as string | undefined)?.trim() || null
  }

  return null // no provider configured → caller uses canned fallback
}

export function hasProvider() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY)
}

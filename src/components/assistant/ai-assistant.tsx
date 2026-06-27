'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Bot, Mic, Paperclip, Send, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Msg { role: 'user' | 'ai'; text: string }

const SUGGESTIONS = ['Increase my website traffic', 'Write a launch email', 'Audit my SEO', 'Find my best audience']

const CANNED: Record<string, string> = {
  default:
    "Here's what I'd do: 1) tighten your top 3 audiences, 2) shift budget to your best-performing channel, 3) ship 2 fresh creatives. Want me to set this up as an automation?",
  traffic:
    'Analyzing your website… I found 5 optimization opportunities: fix 12 broken links, target 38 high-intent keywords, speed up LCP by 1.4s, add 3 internal link clusters, and refresh 4 stale posts. Shall I queue these for the SEO agent?',
  email:
    "Drafted a 3-email launch sequence with subject lines, preview text, and CTAs — projected 41% open rate based on your list. Want me to schedule it?",
  seo: 'Running a full audit… Technical score 82/100. Top wins: compress 56 images, add schema to 9 templates, and fix 3 redirect chains. I can apply the safe fixes automatically.',
}

function reply(input: string) {
  const q = input.toLowerCase()
  if (q.includes('traffic')) return CANNED.traffic
  if (q.includes('email')) return CANNED.email
  if (q.includes('seo') || q.includes('audit')) return CANNED.seo
  return CANNED.default
}

export function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const reduce = useReducedMotion()
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', text: "Hi, I'm Nova — your AI growth assistant. Ask me to grow traffic, write content, or optimize a campaign." },
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  function send(text: string) {
    const value = text.trim()
    if (!value || typing) return
    setMessages((m) => [...m, { role: 'user', text: value }])
    setInput('')
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { role: 'ai', text: reply(value) }])
    }, 1100)
  }

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        type="button"
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-2xl bg-brand-gradient text-white glow-brand"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={open ? 'x' : 'bot'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
            {open ? <X className="size-6" /> : <Bot className="size-6" />}
          </motion.span>
        </AnimatePresence>
        {!open && <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-accent ring-2 ring-bg" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="AI assistant"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong fixed bottom-24 right-5 z-50 flex h-[32rem] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-3xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <Sparkles className="size-[18px]" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">Nova AI</p>
                <p className="flex items-center gap-1.5 text-xs text-fg-muted">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> Online · replies instantly
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                      m.role === 'user' ? 'bg-brand-gradient text-white' : 'glass text-fg',
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="glass flex items-center gap-1 rounded-2xl px-3.5 py-3">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="size-1.5 animate-bounce rounded-full bg-fg-muted" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-line glass px-3 py-1 text-xs text-fg-muted transition-colors hover:text-fg">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input) }}
              className="flex items-center gap-2 border-t border-line px-3 py-3"
            >
              <button type="button" aria-label="Attach file" className="grid size-9 place-items-center rounded-xl text-fg-muted transition-colors hover:text-fg"><Paperclip className="size-[18px]" /></button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Nova anything…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-muted"
              />
              <button type="button" aria-label="Voice input" className="grid size-9 place-items-center rounded-xl text-fg-muted transition-colors hover:text-fg"><Mic className="size-[18px]" /></button>
              <button type="submit" aria-label="Send" className="grid size-9 place-items-center rounded-xl bg-brand-gradient text-white transition-transform active:scale-95"><Send className="size-[18px]" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

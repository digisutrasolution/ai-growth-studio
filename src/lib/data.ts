import {
  Megaphone, TrendingUp, PenLine, Target, Headphones,
  Share2, MousePointerClick, Search, Mail, Sparkles, Workflow, Gauge, BarChart3,
  Users, Bot, FileText, Plug, Brain,
  LayoutDashboard, Megaphone as CampaignIcon, UserPlus, Building2, Settings, Receipt, ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

/* ── AI Agent Marketplace ─────────────────────────────────────── */
export interface Agent {
  id: string
  name: string
  tagline: string
  description: string
  icon: LucideIcon
  accent: string // tailwind text color class
  glow: string // hex for soft glow
  capabilities: string[]
  stats: { label: string; value: string }[]
}

export const agents: Agent[] = [
  {
    id: 'marketing',
    name: 'Marketing AI Agent',
    tagline: 'Plans, launches & optimizes campaigns',
    description: 'Builds full-funnel campaigns, finds your highest-intent audiences, and continuously reallocates budget toward what converts.',
    icon: Megaphone,
    accent: 'text-violet-400',
    glow: '#7c3aed',
    capabilities: ['Campaign creation', 'Audience targeting', 'Ad optimization'],
    stats: [{ label: 'Campaigns run', value: '48.2k' }, { label: 'Avg. ROAS lift', value: '+34%' }],
  },
  {
    id: 'seo',
    name: 'SEO AI Agent',
    tagline: 'Ranks you higher, automatically',
    description: 'Researches keywords, audits your site for technical issues, and ships prioritized fixes to climb the SERPs.',
    icon: TrendingUp,
    accent: 'text-blue-400',
    glow: '#2563eb',
    capabilities: ['Keyword research', 'Website audit', 'Ranking suggestions'],
    stats: [{ label: 'Keywords tracked', value: '2.1M' }, { label: 'Pages audited', value: '860k' }],
  },
  {
    id: 'content',
    name: 'Content AI Agent',
    tagline: 'On-brand content at scale',
    description: 'Writes blogs, social posts, and ad copy in your brand voice — researched, SEO-aware, and ready to publish.',
    icon: PenLine,
    accent: 'text-cyan-400',
    glow: '#06b6d4',
    capabilities: ['Blog writing', 'Social media posts', 'Copy generation'],
    stats: [{ label: 'Assets created', value: '5.4M' }, { label: 'Hours saved', value: '120k+' }],
  },
  {
    id: 'sales',
    name: 'Sales AI Agent',
    tagline: 'Never drop a hot lead again',
    description: 'Scores and qualifies inbound leads, runs personalized follow-up sequences, and keeps your CRM perfectly clean.',
    icon: Target,
    accent: 'text-emerald-400',
    glow: '#10b981',
    capabilities: ['Lead qualification', 'Follow-up automation', 'CRM updates'],
    stats: [{ label: 'Leads qualified', value: '1.3M' }, { label: 'Reply rate', value: '+41%' }],
  },
  {
    id: 'support',
    name: 'Customer Support AI Agent',
    tagline: '24/7 resolution on autopilot',
    description: 'Answers customers instantly from your knowledge base, triages tickets, and escalates only what truly needs a human.',
    icon: Headphones,
    accent: 'text-fuchsia-400',
    glow: '#d946ef',
    capabilities: ['24/7 chatbot', 'Ticket handling', 'Knowledge base'],
    stats: [{ label: 'Tickets resolved', value: '9.7M' }, { label: 'Auto-resolve', value: '78%' }],
  },
]

/* ── Digital Marketing Services ───────────────────────────────── */
export interface Service { name: string; description: string; icon: LucideIcon }

export const services: Service[] = [
  { name: 'Social Media Marketing', description: 'Schedule, publish & optimize across every network from one place.', icon: Share2 },
  { name: 'Google Ads Management', description: 'AI-managed bidding and creative testing that lowers your CPA.', icon: MousePointerClick },
  { name: 'SEO Optimization', description: 'Technical + content SEO that compounds organic traffic.', icon: Search },
  { name: 'Email Marketing', description: 'Behavioral, personalized journeys that actually convert.', icon: Mail },
  { name: 'Brand Growth', description: 'Positioning, voice and creative that make you unmissable.', icon: Sparkles },
  { name: 'AI Automation', description: 'Turn repetitive marketing ops into self-running workflows.', icon: Workflow },
  { name: 'Conversion Optimization', description: 'Continuous A/B testing to squeeze more from every visit.', icon: Gauge },
  { name: 'Marketing Analytics', description: 'Unified attribution and reporting you can finally trust.', icon: BarChart3 },
]

/* ── Advanced Features ────────────────────────────────────────── */
export interface Feature { name: string; description: string; icon: LucideIcon; points: string[] }

export const features: Feature[] = [
  { name: 'AI Automation Engine', icon: Workflow, description: 'Drag-and-drop workflows that trigger themselves.', points: ['Visual workflow builder', 'Trigger & action library', 'Smart branching logic'] },
  { name: 'Customer Intelligence', icon: Brain, description: 'Know every customer before they tell you.', points: ['Behavioral tracking', 'Predictive segments', '1:1 personalization'] },
  { name: 'Marketing Reports', icon: FileText, description: 'Boardroom-ready reporting in one click.', points: ['Real-time dashboards', 'Export PDF / CSV', 'Scheduled delivery'] },
  { name: 'Integrations', icon: Plug, description: 'Plugs into the stack you already run.', points: ['CRM & email platforms', 'Social & payments', 'Analytics tools'] },
]

/* ── Pricing ──────────────────────────────────────────────────── */
export interface Plan {
  name: string
  blurb: string
  monthly: number
  yearly: number
  featured?: boolean
  cta: string
  features: string[]
}

export const plans: Plan[] = [
  {
    name: 'Starter',
    blurb: 'For founders testing the AI waters.',
    monthly: 39,
    yearly: 31,
    cta: 'Start free trial',
    features: ['2 AI agents', '5 active campaigns', 'Basic analytics', 'Email support', '10k automated actions / mo'],
  },
  {
    name: 'Professional',
    blurb: 'For growing teams that run on automation.',
    monthly: 129,
    yearly: 103,
    featured: true,
    cta: 'Start free trial',
    features: ['All 5 AI agents', 'Unlimited campaigns', 'Advanced analytics & attribution', 'Automation engine', 'A/B testing', 'Priority support', '250k automated actions / mo'],
  },
  {
    name: 'Enterprise',
    blurb: 'For organizations that need control & scale.',
    monthly: 0,
    yearly: 0,
    cta: 'Book a demo',
    features: ['Unlimited AI agents', 'Custom AI models', 'Full API access', 'SSO, 2FA & audit logs', 'Dedicated success manager', '99.99% uptime SLA', 'Unlimited actions'],
  },
]

/* ── Trust / integration logos (text marquee) ─────────────────── */
export const integrations = ['Salesforce', 'HubSpot', 'Shopify', 'Stripe', 'Meta Ads', 'Google Ads', 'Mailchimp', 'Slack', 'Zapier', 'Notion', 'Segment', 'Klaviyo']

/* ── Headline metrics ─────────────────────────────────────────── */
export const heroStats = [
  { label: 'Revenue influenced', value: '$2.4B+' },
  { label: 'Active businesses', value: '38,000+' },
  { label: 'Tasks automated', value: '1.2B' },
  { label: 'Avg. time saved', value: '21 hrs/wk' },
]

/* ── App dashboard mock data ──────────────────────────────────── */
export const appNav: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Agents', href: '/dashboard/agents', icon: Bot },
  { label: 'Campaigns', href: '/dashboard/campaigns', icon: CampaignIcon },
  { label: 'Leads', href: '/dashboard/leads', icon: UserPlus },
  { label: 'Customers', href: '/dashboard/customers', icon: Users },
  { label: 'Automation', href: '/dashboard/automation', icon: Workflow },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Reports', href: '/dashboard/reports', icon: FileText },
  { label: 'Billing', href: '/dashboard/billing', icon: Receipt },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export const adminNav: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'Admin overview', href: '/dashboard/admin', icon: ShieldCheck },
]

export const dashboardStats = [
  { label: 'Revenue', value: '$284,920', delta: '+18.2%', trend: 'up' as const },
  { label: 'Conversion rate', value: '4.86%', delta: '+0.7pt', trend: 'up' as const },
  { label: 'Active campaigns', value: '32', delta: '+5', trend: 'up' as const },
  { label: 'New leads', value: '1,284', delta: '-3.1%', trend: 'down' as const },
]

export const revenueSeries = [
  { month: 'Jan', revenue: 42000, spend: 18000 },
  { month: 'Feb', revenue: 48000, spend: 19500 },
  { month: 'Mar', revenue: 51000, spend: 20000 },
  { month: 'Apr', revenue: 62000, spend: 22000 },
  { month: 'May', revenue: 68000, spend: 23500 },
  { month: 'Jun', revenue: 79000, spend: 24000 },
  { month: 'Jul', revenue: 88000, spend: 25500 },
  { month: 'Aug', revenue: 96000, spend: 27000 },
  { month: 'Sep', revenue: 104000, spend: 28000 },
  { month: 'Oct', revenue: 121000, spend: 29500 },
  { month: 'Nov', revenue: 138000, spend: 31000 },
  { month: 'Dec', revenue: 162000, spend: 33000 },
]

export const channelData = [
  { channel: 'Paid Search', value: 38 },
  { channel: 'Social', value: 27 },
  { channel: 'Email', value: 18 },
  { channel: 'Organic', value: 12 },
  { channel: 'Referral', value: 5 },
]

export const aiRecommendations = [
  { title: 'Shift 15% budget to TikTok', detail: 'CPA there is 32% lower than Meta this week.', impact: 'High' as const },
  { title: 'Pause 3 underperforming ad sets', detail: 'They are below 0.8 ROAS over 7 days.', impact: 'Medium' as const },
  { title: 'Send win-back email to 2,140 users', detail: 'Predicted churn within 14 days.', impact: 'High' as const },
  { title: 'Refresh 5 ad creatives', detail: 'Frequency above 4.0 — fatigue detected.', impact: 'Low' as const },
]

export const campaignRows = [
  { name: 'Summer Launch — Meta', status: 'Active', spend: '$12,480', roas: '4.2x', conv: '1,204' },
  { name: 'Retargeting — Google', status: 'Active', spend: '$8,120', roas: '5.6x', conv: '842' },
  { name: 'Newsletter Q4', status: 'Scheduled', spend: '$0', roas: '—', conv: '0' },
  { name: 'Black Friday Teaser', status: 'Active', spend: '$21,300', roas: '3.8x', conv: '2,560' },
  { name: 'Brand Awareness — TikTok', status: 'Paused', spend: '$5,640', roas: '1.9x', conv: '410' },
]

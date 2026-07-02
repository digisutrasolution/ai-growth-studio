import {
  Megaphone, TrendingUp, PenLine, Target, Headphones,
  Share2, MousePointerClick, Search, Mail, Sparkles, Workflow, Gauge, BarChart3,
  Users, Bot, FileText, Plug, Brain,
  LayoutDashboard, Megaphone as CampaignIcon, UserPlus, Settings, Receipt, ShieldCheck,
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

// INR pricing (whole rupees) per plan, keyed by plan name. USD prices live on
// each plan (monthly/yearly). Used by the multi-currency billing checkout.
export const planPriceInr: Record<string, { monthly: number; yearly: number }> = {
  Starter: { monthly: 2999, yearly: 2399 },
  Professional: { monthly: 9999, yearly: 7999 },
  Enterprise: { monthly: 0, yearly: 0 },
}

/* ── Trust / integration logos (text marquee) ─────────────────── */
export const integrations = ['Salesforce', 'HubSpot', 'Shopify', 'Stripe', 'Meta Ads', 'Google Ads', 'Mailchimp', 'Slack', 'Zapier', 'Notion', 'Segment', 'Klaviyo']

/* ── Headline metrics ─────────────────────────────────────────── */
export const heroStats = [
  { label: 'Revenue influenced', value: '$2.4B+' },
  { label: 'Active businesses', value: '38,000+' },
  { label: 'Tasks automated', value: '1.2B' },
  { label: 'Avg. time saved', value: '21 hrs/wk' },
]

/* ── Reports (for /dashboard/reports) ─────────────────────────── */
export const reportTemplates: { name: string; description: string; icon: LucideIcon }[] = [
  { name: 'Executive summary', description: 'High-level KPIs for leadership.', icon: BarChart3 },
  { name: 'Channel performance', description: 'ROAS & spend by channel.', icon: TrendingUp },
  { name: 'Campaign deep-dive', description: 'Per-campaign metrics & creatives.', icon: Megaphone },
  { name: 'Customer cohorts', description: 'Retention & LTV by cohort.', icon: Users },
  { name: 'Lead funnel', description: 'Conversion at every stage.', icon: UserPlus },
  { name: 'Email engagement', description: 'Opens, clicks & deliverability.', icon: Mail },
]

export const scheduledReports = [
  { name: 'Weekly executive summary', frequency: 'Every Mon, 8:00 AM', format: 'PDF', recipients: 5, status: 'Active' as const },
  { name: 'Monthly channel report', frequency: '1st of month, 9:00 AM', format: 'PDF + CSV', recipients: 12, status: 'Active' as const },
  { name: 'Daily spend alert', frequency: 'Daily, 7:00 AM', format: 'CSV', recipients: 3, status: 'Active' as const },
  { name: 'Quarterly board deck', frequency: 'Quarterly', format: 'PDF', recipients: 8, status: 'Paused' as const },
]

export const recentReports = [
  { name: 'Executive summary — Jun W4', date: 'Jun 28, 2026', format: 'PDF', size: '1.2 MB' },
  { name: 'Channel performance — Jun', date: 'Jun 27, 2026', format: 'CSV', size: '480 KB' },
  { name: 'Campaign deep-dive — Black Friday', date: 'Jun 24, 2026', format: 'PDF', size: '3.4 MB' },
  { name: 'Customer cohorts — Q2', date: 'Jun 20, 2026', format: 'PDF', size: '2.1 MB' },
]

/* ── Settings: team & roles (for /dashboard/settings) ─────────── */
export type TeamRole = 'Owner' | 'Admin' | 'Editor' | 'Viewer'

export const teamMembers: { name: string; email: string; role: TeamRole; initials: string; status: 'Active' | 'Invited' }[] = [
  { name: 'Steven', email: 'steven@digisutra.solutions', role: 'Owner', initials: 'ST', status: 'Active' },
  { name: 'Priya Nair', email: 'priya@digisutra.solutions', role: 'Admin', initials: 'PN', status: 'Active' },
  { name: 'Marcus Lee', email: 'marcus@digisutra.solutions', role: 'Editor', initials: 'ML', status: 'Active' },
  { name: 'Hana Sato', email: 'hana@digisutra.solutions', role: 'Editor', initials: 'HS', status: 'Active' },
  { name: 'Owen Walsh', email: 'owen@digisutra.solutions', role: 'Viewer', initials: 'OW', status: 'Invited' },
]

export const roleStyles: Record<TeamRole, string> = {
  Owner: 'bg-violet-400/15 text-violet-400',
  Admin: 'bg-blue-400/15 text-blue-400',
  Editor: 'bg-cyan-400/15 text-cyan-400',
  Viewer: 'bg-fg/10 text-fg-muted',
}

export const notificationPrefs = [
  { label: 'Campaign performance alerts', detail: 'When ROAS drops below target', on: true },
  { label: 'New lead notifications', detail: 'High-score leads in real time', on: true },
  { label: 'Weekly summary email', detail: 'Every Monday morning', on: true },
  { label: 'AI agent recommendations', detail: 'When agents suggest actions', on: false },
  { label: 'Billing & usage warnings', detail: 'Approaching plan limits', on: true },
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

/* ── Campaigns (detailed, for /dashboard/campaigns) ───────────── */
export type CampaignStatus = 'Active' | 'Scheduled' | 'Paused' | 'Completed'

export interface Campaign {
  id: string
  name: string
  audience: string
  channel: 'Meta' | 'Google' | 'TikTok' | 'Email' | 'LinkedIn'
  status: CampaignStatus
  budget: number
  spent: number
  roas: number | null
  conversions: number
  ctr: string
  abTest: boolean
}

export const channelStyles: Record<Campaign['channel'], string> = {
  Meta: 'bg-blue-400/15 text-blue-400',
  Google: 'bg-amber-400/15 text-amber-400',
  TikTok: 'bg-fuchsia-400/15 text-fuchsia-400',
  Email: 'bg-cyan-400/15 text-cyan-400',
  LinkedIn: 'bg-violet-400/15 text-violet-400',
}

export const campaignStatusStyles: Record<CampaignStatus, string> = {
  Active: 'bg-emerald-400/15 text-emerald-400',
  Scheduled: 'bg-blue-400/15 text-blue-400',
  Paused: 'bg-amber-400/15 text-amber-400',
  Completed: 'bg-fg/10 text-fg-muted',
}

/* ── Automation (workflow builder, for /dashboard/automation) ──── */
export type NodeKind = 'trigger' | 'condition' | 'action'

export interface FlowNode { kind: NodeKind; label: string; detail: string; icon: LucideIcon }

export interface Workflow {
  id: string
  name: string
  status: 'Live' | 'Paused'
  runs: number
  successRate: number
  nodes: FlowNode[]
}

export const workflows: Workflow[] = [
  {
    id: 'w1',
    name: 'Hot lead fast-track',
    status: 'Live',
    runs: 4820,
    successRate: 99.2,
    nodes: [
      { kind: 'trigger', label: 'New lead created', detail: 'Source: any', icon: UserPlus },
      { kind: 'condition', label: 'Lead score > 80', detail: 'Predictive scoring', icon: Gauge },
      { kind: 'action', label: 'Notify sales in Slack', detail: '#sales-hot channel', icon: Bot },
      { kind: 'action', label: 'Start follow-up sequence', detail: '3-step email', icon: Mail },
    ],
  },
  {
    id: 'w2',
    name: 'Win-back dormant customers',
    status: 'Live',
    runs: 1260,
    successRate: 97.5,
    nodes: [
      { kind: 'trigger', label: 'No activity 60 days', detail: 'Segment: Dormant', icon: Users },
      { kind: 'action', label: 'Send win-back offer', detail: '15% discount', icon: Mail },
      { kind: 'action', label: 'Retarget on Meta', detail: 'Custom audience', icon: Share2 },
    ],
  },
  {
    id: 'w3',
    name: 'Abandoned cart recovery',
    status: 'Paused',
    runs: 8910,
    successRate: 94.8,
    nodes: [
      { kind: 'trigger', label: 'Cart abandoned', detail: 'After 1 hour', icon: MousePointerClick },
      { kind: 'condition', label: 'Cart value > $50', detail: 'High intent', icon: Gauge },
      { kind: 'action', label: 'Send reminder email', detail: 'Dynamic product block', icon: Mail },
    ],
  },
  {
    id: 'w4',
    name: 'Content publish → promote',
    status: 'Live',
    runs: 540,
    successRate: 100,
    nodes: [
      { kind: 'trigger', label: 'Blog post published', detail: 'CMS webhook', icon: PenLine },
      { kind: 'action', label: 'Generate social posts', detail: 'Content AI Agent', icon: Sparkles },
      { kind: 'action', label: 'Schedule across channels', detail: '4 networks', icon: Share2 },
    ],
  },
]

export const nodeKindStyles: Record<NodeKind, { ring: string; chip: string; label: string }> = {
  trigger: { ring: 'border-violet-400/40', chip: 'bg-violet-400/15 text-violet-400', label: 'Trigger' },
  condition: { ring: 'border-amber-400/40', chip: 'bg-amber-400/15 text-amber-400', label: 'Condition' },
  action: { ring: 'border-cyan-400/40', chip: 'bg-cyan-400/15 text-cyan-400', label: 'Action' },
}

/* ── Customers (for /dashboard/customers) ─────────────────────── */
export type CustomerHealth = 'Healthy' | 'At risk' | 'Churning'

export interface CustomerSegment { name: string; count: number; share: number; accent: string }

export const customerSegments: CustomerSegment[] = [
  { name: 'Champions', count: 1840, share: 22, accent: 'text-emerald-400' },
  { name: 'Loyal', count: 3120, share: 37, accent: 'text-blue-400' },
  { name: 'Promising', count: 1560, share: 18, accent: 'text-cyan-400' },
  { name: 'At risk', count: 980, share: 12, accent: 'text-amber-400' },
  { name: 'Dormant', count: 920, share: 11, accent: 'text-rose-400' },
]

export interface Customer {
  id: string
  name: string
  email: string
  initials: string
  segment: string
  ltv: number
  orders: number
  lastActive: string
  health: CustomerHealth
  activity: number[]
}

export const customerHealthStyles: Record<CustomerHealth, string> = {
  Healthy: 'bg-emerald-400/15 text-emerald-400',
  'At risk': 'bg-amber-400/15 text-amber-400',
  Churning: 'bg-rose-400/15 text-rose-400',
}

export const customers: Customer[] = [
  { id: 'u1', name: 'Ava Thompson', email: 'ava@northwind.co', initials: 'AT', segment: 'Champions', ltv: 8420, orders: 24, lastActive: '2h ago', health: 'Healthy', activity: [3, 5, 4, 6, 7, 6, 8] },
  { id: 'u2', name: 'Marcus Lee', email: 'marcus@pixelforge.io', initials: 'ML', segment: 'Loyal', ltv: 4180, orders: 16, lastActive: '1d ago', health: 'Healthy', activity: [4, 4, 5, 3, 5, 4, 5] },
  { id: 'u3', name: 'Priya Nair', email: 'priya@bloomgrid.com', initials: 'PN', segment: 'Champions', ltv: 12600, orders: 38, lastActive: '5h ago', health: 'Healthy', activity: [6, 7, 8, 7, 9, 8, 9] },
  { id: 'u4', name: 'Diego Ramos', email: 'diego@vela.dev', initials: 'DR', segment: 'At risk', ltv: 2240, orders: 9, lastActive: '21d ago', health: 'At risk', activity: [5, 4, 3, 2, 2, 1, 1] },
  { id: 'u5', name: 'Sophie Klein', email: 'sophie@arc.studio', initials: 'SK', segment: 'Promising', ltv: 3380, orders: 11, lastActive: '3d ago', health: 'Healthy', activity: [2, 3, 4, 4, 5, 5, 6] },
  { id: 'u6', name: 'Tom Becker', email: 'tom@quantal.io', initials: 'TB', segment: 'Dormant', ltv: 1120, orders: 4, lastActive: '64d ago', health: 'Churning', activity: [4, 3, 2, 1, 1, 0, 0] },
  { id: 'u7', name: 'Hana Sato', email: 'hana@lumen.ai', initials: 'HS', segment: 'Champions', ltv: 15800, orders: 47, lastActive: '1h ago', health: 'Healthy', activity: [7, 8, 8, 9, 9, 10, 10] },
  { id: 'u8', name: 'Owen Walsh', email: 'owen@cedar.co', initials: 'OW', segment: 'Loyal', ltv: 5260, orders: 19, lastActive: '4d ago', health: 'At risk', activity: [6, 5, 5, 4, 4, 3, 3] },
]

/* ── Leads (pipeline kanban, for /dashboard/leads) ────────────── */
export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won'
export const leadStages: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won']

export interface Lead {
  id: string
  name: string
  company: string
  value: number
  score: number
  stage: LeadStage
  source: 'Meta' | 'Google' | 'Email' | 'Referral' | 'Organic'
  initials: string
}

export const leads: Lead[] = [
  { id: 'l1', name: 'Ava Thompson', company: 'Northwind Co', value: 12000, score: 92, stage: 'New', source: 'Google', initials: 'AT' },
  { id: 'l2', name: 'Marcus Lee', company: 'Pixel Forge', value: 4800, score: 64, stage: 'New', source: 'Meta', initials: 'ML' },
  { id: 'l3', name: 'Priya Nair', company: 'Bloomgrid', value: 28000, score: 88, stage: 'Contacted', source: 'Referral', initials: 'PN' },
  { id: 'l4', name: 'Diego Ramos', company: 'Vela Labs', value: 9500, score: 71, stage: 'Contacted', source: 'Organic', initials: 'DR' },
  { id: 'l5', name: 'Sophie Klein', company: 'Arc Studio', value: 15500, score: 81, stage: 'Qualified', source: 'Email', initials: 'SK' },
  { id: 'l6', name: 'Tom Becker', company: 'Quantal', value: 6200, score: 47, stage: 'Qualified', source: 'Meta', initials: 'TB' },
  { id: 'l7', name: 'Hana Sato', company: 'Lumen AI', value: 42000, score: 95, stage: 'Proposal', source: 'Referral', initials: 'HS' },
  { id: 'l8', name: 'Owen Walsh', company: 'Cedar & Co', value: 18800, score: 76, stage: 'Proposal', source: 'Google', initials: 'OW' },
  { id: 'l9', name: 'Lena Petrova', company: 'Driftwave', value: 33000, score: 90, stage: 'Won', source: 'Email', initials: 'LP' },
  { id: 'l10', name: 'Raj Patel', company: 'Stackbloom', value: 21000, score: 84, stage: 'Won', source: 'Organic', initials: 'RP' },
  { id: 'l11', name: 'Mia Conti', company: 'Fernweh', value: 5400, score: 58, stage: 'New', source: 'Meta', initials: 'MC' },
  { id: 'l12', name: 'Noah Kim', company: 'Brightline', value: 11200, score: 79, stage: 'Contacted', source: 'Google', initials: 'NK' },
]

export const campaigns: Campaign[] = [
  { id: 'c1', name: 'Summer Launch', audience: 'Lookalike 1% · US/CA', channel: 'Meta', status: 'Active', budget: 20000, spent: 12480, roas: 4.2, conversions: 1204, ctr: '2.8%', abTest: true },
  { id: 'c2', name: 'Retargeting — Cart', audience: 'Cart abandoners 30d', channel: 'Google', status: 'Active', budget: 10000, spent: 8120, roas: 5.6, conversions: 842, ctr: '4.1%', abTest: false },
  { id: 'c3', name: 'Newsletter Q4', audience: 'All subscribers', channel: 'Email', status: 'Scheduled', budget: 2000, spent: 0, roas: null, conversions: 0, ctr: '—', abTest: false },
  { id: 'c4', name: 'Black Friday Teaser', audience: 'Engaged 90d', channel: 'Meta', status: 'Active', budget: 30000, spent: 21300, roas: 3.8, conversions: 2560, ctr: '3.3%', abTest: true },
  { id: 'c5', name: 'Brand Awareness', audience: 'Interest: marketing', channel: 'TikTok', status: 'Paused', budget: 15000, spent: 5640, roas: 1.9, conversions: 410, ctr: '1.7%', abTest: false },
  { id: 'c6', name: 'Demo Webinar Promo', audience: 'B2B · 50-500 emp', channel: 'LinkedIn', status: 'Active', budget: 12000, spent: 7350, roas: 3.1, conversions: 318, ctr: '0.9%', abTest: true },
  { id: 'c7', name: 'Spring Sale (wrap-up)', audience: 'All customers', channel: 'Google', status: 'Completed', budget: 18000, spent: 18000, roas: 4.9, conversions: 2140, ctr: '3.6%', abTest: false },
  { id: 'c8', name: 'Win-back Flow', audience: 'Churn risk 14d', channel: 'Email', status: 'Active', budget: 3000, spent: 1120, roas: 6.4, conversions: 540, ctr: '5.2%', abTest: true },
]

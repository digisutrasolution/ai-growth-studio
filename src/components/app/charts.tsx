'use client'

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { revenueSeries, channelData } from '@/lib/data'

const tooltipStyle = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--line)',
  borderRadius: 12,
  fontSize: 12,
  color: 'var(--fg)',
}

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={revenueSeries} margin={{ left: -18, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: 'var(--fg-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--fg-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => `$${Number(v).toLocaleString()}`} cursor={{ stroke: 'var(--line)' }} />
        <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} fill="url(#rev)" />
        <Area type="monotone" dataKey="spend" stroke="#06b6d4" strokeWidth={2} fill="url(#spend)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const channelColors = ['#7c3aed', '#2563eb', '#06b6d4', '#10b981', '#d946ef']

export function ChannelChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={channelData} layout="vertical" margin={{ left: 18, right: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
        <XAxis type="number" tick={{ fill: 'var(--fg-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
        <YAxis type="category" dataKey="channel" tick={{ fill: 'var(--fg-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={78} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${Number(v)}%`} cursor={{ fill: 'var(--line)' }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
          {channelData.map((_, i) => <Cell key={i} fill={channelColors[i % channelColors.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

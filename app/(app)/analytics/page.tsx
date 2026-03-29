'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassChart } from '@/components/glass/glass-chart'
import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import React from 'react'

const performanceData = [
  { month: 'Jan', returns: 2400, gains: 1200 },
  { month: 'Feb', returns: 1398, gains: 1221 },
  { month: 'Mar', returns: 9800, gains: 2290 },
  { month: 'Apr', returns: 3908, gains: 2000 },
  { month: 'May', returns: 4800, gains: 2181 },
  { month: 'Jun', returns: 3800, gains: 2500 },
  { month: 'Jul', returns: 4300, gains: 2100 },
]

const portfolioAllocation = [
  { name: 'Bitcoin', value: 35, color: '#00A8FF' },
  { name: 'Ethereum', value: 25, color: '#39FF9E' },
  { name: 'Altcoins', value: 20, color: '#1E90FF' },
  { name: 'Stables', value: 20, color: '#00C4FF' },
]

const metrics = [
  { label: 'Total ROI', value: '+42.5%', trend: 'up', color: 'text-neon-green' },
  { label: 'Win Rate', value: '68%', trend: 'up', color: 'text-neon-green' },
  { label: 'Avg. Trade', value: '+$234.50', trend: 'up', color: 'text-neon-green' },
  { label: 'Best Day', value: '+$1,245', trend: 'up', color: 'text-neon-green' },
  { label: 'Worst Day', value: '-$342', trend: 'down', color: 'text-red-400' },
  { label: 'Volatility', value: '12.3%', trend: 'neutral', color: 'text-neon-cyan' },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('1M')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio Analytics</h1>
          <p className="text-white/60 mt-2">Detailed insights into your investment performance</p>
        </div>
        <div className="flex gap-2">
          {['1W', '1M', '3M', '1Y', 'ALL'].map(range => (
            <GlassButton
              key={range}
              variant={timeRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </GlassButton>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <GlassCard key={idx} variant="nested">
            <p className="text-white/60 text-sm mb-2">{metric.label}</p>
            <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-white/50">
                {metric.trend === 'up' && '↑'}
                {metric.trend === 'down' && '↓'}
              </span>
              <span className="text-xs text-white/50">vs last period</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2">
          <GlassChart title="Returns Over Time" subtitle={`Last ${timeRange}`}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.3)" />
                <YAxis stroke="rgba(255,255,255,0.3)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 15, 37, 0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="returns"
                  stroke="#00A8FF"
                  strokeWidth={2}
                  dot={false}
                  name="Total Returns"
                />
                <Line
                  type="monotone"
                  dataKey="gains"
                  stroke="#39FF9E"
                  strokeWidth={2}
                  dot={false}
                  name="Capital Gains"
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassChart>
        </div>

        {/* Pie Chart */}
        <GlassChart title="Portfolio Allocation">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={portfolioAllocation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {portfolioAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 15, 37, 0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </GlassChart>
      </div>

      {/* Bar Chart */}
      <GlassChart title="Monthly Comparison">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis stroke="rgba(255,255,255,0.3)" />
            <YAxis stroke="rgba(255,255,255,0.3)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 15, 37, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Bar dataKey="returns" fill="#00A8FF" name="Returns" />
            <Bar dataKey="gains" fill="#39FF9E" name="Gains" />
          </BarChart>
        </ResponsiveContainer>
      </GlassChart>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard variant="elevated">
          <h3 className="text-xl font-bold text-white mb-4">Performance Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Total Invested</span>
              <span className="text-white font-semibold">$25,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Current Value</span>
              <span className="text-neon-green font-semibold">$35,625</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between items-center">
              <span className="text-white/70">Total Profit</span>
              <span className="text-neon-green font-bold text-lg">+$10,625</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="elevated">
          <h3 className="text-xl font-bold text-white mb-4">Best Performers</h3>
          <div className="space-y-3">
            {[
              { asset: 'Bitcoin', return: '+45.2%', color: 'text-neon-green' },
              { asset: 'Ethereum', return: '+38.5%', color: 'text-neon-green' },
              { asset: 'Altcoin A', return: '+62.3%', color: 'text-neon-green' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-white/70">{item.asset}</span>
                <span className={`font-semibold ${item.color}`}>{item.return}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

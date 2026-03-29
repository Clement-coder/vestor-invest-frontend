'use client'

import { GlassCard } from '@/components/glass/glass-card'
import { GlassButton } from '@/components/glass/glass-button'
import { GlassModal } from '@/components/glass/glass-modal'
import { Check } from 'lucide-react'
import { useState } from 'react'
import React from 'react'

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false)

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      apy: '8.5%',
      min: '$100',
      max: '$5,000',
      description: 'Perfect for beginners',
      features: [
        'Basic portfolio analytics',
        'Daily market updates',
        'Email support',
        'Mobile app access',
        'Basic charts',
        'Monthly reports',
      ],
      glow: 'cyan' as const,
    },
    {
      id: 'growth',
      name: 'Growth',
      apy: '12.5%',
      min: '$1,000',
      max: '$50,000',
      description: 'For active investors',
      features: [
        'Advanced analytics',
        'Real-time updates',
        'Priority support',
        'Mobile app access',
        'Advanced charts',
        'Weekly reports',
        'Portfolio optimization',
        'Risk assessment',
      ],
      glow: 'none' as const,
    },
    {
      id: 'premium',
      name: 'Premium',
      apy: '16.5%',
      min: '$10,000',
      max: '$100,000',
      description: 'For serious traders',
      features: [
        'AI-powered insights',
        'Live trading signals',
        'Dedicated account manager',
        'Mobile app access',
        'Premium charts',
        'Daily reports',
        'Portfolio rebalancing',
        'Tax planning tools',
        'API access',
      ],
      glow: 'green' as const,
    },
    {
      id: 'exclusive',
      name: 'Exclusive',
      apy: '20.5%',
      min: '$100,000',
      max: 'Unlimited',
      description: 'For elite investors',
      features: [
        'All Premium features',
        'Personal portfolio manager',
        'Direct trading execution',
        'Custom strategies',
        'VIP support 24/7',
        'Real-time alerts',
        'Hedge fund access',
        'Private investment opportunities',
        'Quarterly reviews',
      ],
      glow: 'cyan' as const,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-white">Investment Plans</h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Choose the perfect investment plan tailored to your financial goals and investment capacity
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map(plan => (
          <GlassCard
            key={plan.id}
            variant="elevated"
            hover
            glow={plan.glow}
            className="flex flex-col relative overflow-hidden"
          >
            {/* Badge */}
            {plan.id === 'premium' && (
              <div className="absolute top-4 right-4 bg-neon-green/20 border border-neon-green/50 rounded-lg px-3 py-1 text-xs font-bold text-neon-green">
                Popular
              </div>
            )}

            <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
            <p className="text-white/60 text-sm mb-4">{plan.description}</p>

            {/* APY */}
            <div className="mb-6">
              <p className="text-white/60 text-sm">Annual Yield</p>
              <p className="text-3xl font-bold text-gradient-primary">{plan.apy}</p>
            </div>

            {/* Investment Range */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/60 text-xs uppercase tracking-wide mb-2">
                Investment Range
              </p>
              <p className="text-white font-medium">
                {plan.min} - {plan.max}
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-white/70 text-sm">
                  <Check size={14} className="text-[#39ff9e] mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Button */}
            <GlassButton
              variant="primary"
              className="w-full"
              onClick={() => {
                setSelectedPlan(plan.name)
                setInvestmentModalOpen(true)
              }}
            >
              Get Started
            </GlassButton>
          </GlassCard>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">Plan Comparison</h2>
        <div className="overflow-x-auto">
          <GlassCard variant="nested" className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/60 text-sm font-semibold">
                    Feature
                  </th>
                  {plans.map(plan => (
                    <th
                      key={plan.id}
                      className="text-center p-4 text-white font-semibold"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white/60 text-sm">Annual Percentage Yield</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center p-4 text-neon-green font-bold">
                      {plan.apy}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white/60 text-sm">Minimum Investment</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center p-4 text-white">
                      {plan.min}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white/60 text-sm">Maximum Investment</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center p-4 text-white">
                      {plan.max}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white/60 text-sm">24/7 Support</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center p-4">
                      {['starter', 'growth'].includes(plan.id) ? (
                        <span className="text-white/60 text-sm">Email only</span>
                      ) : (
                        <Check size={16} className="text-[#39ff9e] mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 text-white/60 text-sm">Portfolio Manager</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center p-4">
                      {['premium', 'exclusive'].includes(plan.id) ? (
                        <Check size={16} className="text-[#39ff9e] mx-auto" />
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </GlassCard>
        </div>
      </div>

      {/* Investment Modal */}
      <GlassModal
        isOpen={investmentModalOpen}
        onClose={() => setInvestmentModalOpen(false)}
        title={`Invest in ${selectedPlan}`}
        neonBorder="cyan"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Investment Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount in USD"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
            />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-white/80 text-sm">
              <span>Annual Return:</span>
              <span className="text-neon-green font-semibold">Calculated</span>
            </div>
            <div className="flex justify-between text-white/80 text-sm">
              <span>Processing Fee:</span>
              <span className="text-white">0.5%</span>
            </div>
          </div>
          <GlassButton variant="primary" className="w-full">
            Confirm Investment
          </GlassButton>
        </div>
      </GlassModal>
    </div>
  )
}

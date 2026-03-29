'use client'

import { GlassModal } from '@/components/glass/glass-modal'
import { GlassInput } from '@/components/glass/glass-input'
import { GlassButton } from '@/components/glass/glass-button'
import { useState } from 'react'
import React from 'react'

interface InvestmentModalProps {
  isOpen: boolean
  onClose: () => void
  planName?: string
  planAPY?: string
}

export function InvestmentModal({
  isOpen,
  onClose,
  planName = 'Growth',
  planAPY = '12.5%',
}: InvestmentModalProps) {
  const [step, setStep] = useState<'amount' | 'confirm'>('amount')
  const [amount, setAmount] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('Growth')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }))
    }
  }

  const validateAmount = () => {
    const newErrors: Record<string, string> = {}
    const amountNum = parseFloat(amount)

    if (!amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(amountNum)) {
      newErrors.amount = 'Please enter a valid number'
    } else if (amountNum < 100) {
      newErrors.amount = 'Minimum investment is $100'
    } else if (amountNum > 1000000) {
      newErrors.amount = 'Maximum investment is $1,000,000'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirm = async () => {
    if (!validateAmount()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Success - reset and close
      setStep('amount')
      setAmount('')
      onClose()
    } catch (error) {
      setErrors({ submit: 'Failed to process investment. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const amountNum = parseFloat(amount) || 0
  const estimatedReturn = (amountNum * parseFloat(planAPY)) / 100

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invest in ${planName}`}
      neonBorder="cyan"
    >
      {step === 'amount' ? (
        <div className="space-y-6">
          <GlassInput
            label="Investment Amount (USD)"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={handleAmountChange}
            error={errors.amount}
            helperText="Minimum $100, Maximum $1,000,000"
          />

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Select Plan
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 cursor-pointer"
            >
              <option className="bg-background text-white">Starter - 8.5% APY</option>
              <option className="bg-background text-white">Growth - 12.5% APY</option>
              <option className="bg-background text-white">Premium - 16.5% APY</option>
              <option className="bg-background text-white">Exclusive - 20.5% APY</option>
            </select>
          </div>

          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {errors.submit}
            </div>
          )}

          <GlassButton
            variant="primary"
            className="w-full"
            onClick={() => validateAmount() && setStep('confirm')}
            disabled={!amount || isLoading}
          >
            Review Investment
          </GlassButton>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="space-y-4 bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Investment Amount</span>
              <span className="text-white font-semibold">${amountNum.toLocaleString()}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between items-center">
              <span className="text-white/70">Selected Plan</span>
              <span className="text-neon-green font-semibold">{selectedPlan}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between items-center">
              <span className="text-white/70">Est. Annual Return</span>
              <span className="text-neon-green font-bold">${estimatedReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between items-center">
              <span className="text-white/70">Processing Fee</span>
              <span className="text-white text-sm">0.5% (${ (amountNum * 0.005).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 rounded accent-neon-cyan"
            />
            <label htmlFor="terms" className="text-sm text-white/70">
              I agree to the investment terms and understand the risks involved
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <GlassButton
              variant="outline"
              className="flex-1"
              onClick={() => setStep('amount')}
              disabled={isLoading}
            >
              Back
            </GlassButton>
            <GlassButton
              variant="primary"
              className="flex-1"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Confirm Investment'}
            </GlassButton>
          </div>
        </div>
      )}
    </GlassModal>
  )
}

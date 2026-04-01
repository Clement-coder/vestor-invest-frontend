'use client'

import React, { useRef, useCallback } from 'react'
import { Download, Share2, CheckCircle2, Building2, Wallet, AlertCircle } from 'lucide-react'
import { GlassButton } from '@/components/glass/glass-button'
import type { TxRecord } from '@/lib/transactions-store'

interface Props {
  tx: TxRecord
  onDone?: () => void
  showSuccess?: boolean
}

const mono: React.CSSProperties = { fontFamily: '"Courier New", Courier, monospace' }
const col = (opacity: number): React.CSSProperties => ({ color: `rgba(255,255,255,${opacity})` })

function Row({ label, value, isMono }: { label: string; value: string; isMono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ ...col(0.45), fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>{label}</span>
      <span style={{ ...col(0.9), fontSize: 12, textAlign: 'right', wordBreak: 'break-all', maxWidth: '60%', ...(isMono ? mono : {}) }}>{value}</span>
    </div>
  )
}

export function TransactionReceipt({ tx, onDone, showSuccess = false }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const capture = useCallback(async () => {
    if (!receiptRef.current) return null
    const { default: html2canvas } = await import('html2canvas')
    return html2canvas(receiptRef.current, { backgroundColor: '#080d1e', scale: 2, useCORS: true, logging: false, width: 420, windowWidth: 420 })
  }, [])

  const download = useCallback(async () => {
    const canvas = await capture(); if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png'); a.download = `${tx.id}.png`; a.click()
  }, [capture, tx.id])

  const share = useCallback(async () => {
    const canvas = await capture(); if (!canvas) return
    canvas.toBlob(async blob => {
      if (!blob) return
      const file = new File([blob], `${tx.id}.png`, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Vestor Transaction Receipt' })
      } else {
        await navigator.clipboard.writeText(`${tx.id} · $${tx.amount} · ${tx.date}`)
        alert('Receipt details copied to clipboard')
      }
    })
  }, [capture, tx.id, tx.amount, tx.date])

  const statusStyle: React.CSSProperties =
    tx.status === 'Completed' ? { color: '#39ff9e' }
    : tx.status === 'Failed'  ? { color: '#f87171' }
    :                           { color: '#facc15' }

  const details: [string, string, boolean?][] = tx.type === 'Credit'
    ? [
        ['Funded By', 'Vestor Invest — Official Agent'],
        ['Credit Type', 'Account Funding'],
        ['Reference', tx.id],
      ]
    : tx.method === 'bank'
    ? [
        ['Beneficiary', tx.name ?? '—'],
        ['Bank', tx.bankName ?? '—'],
        ['SWIFT / BIC', tx.swift ?? '—', true],
        ['IBAN / Account', tx.iban ?? '—', true],
        ...(tx.routing ? [['Routing / Sort', tx.routing, true] as [string, string, boolean]] : []),
      ]
    : [
        ['Network', (tx.network ?? '').toUpperCase()],
        ['Wallet Address', tx.address ?? '—', true],
      ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Success banner */}
      {showSuccess && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '8px 0' }}>
          <div style={{ position: 'relative', width: 72, height: 72 }}>
            <div className="animate-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(57,255,158,0.15)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(57,255,158,0.12)', border: '2px solid #39ff9e' }}>
              <CheckCircle2 size={32} color="#39ff9e" />
            </div>
          </div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Withdrawal Submitted!</p>
          <p style={{ ...col(0.5), fontSize: 13, textAlign: 'center' }}>Your request is being processed.</p>
        </div>
      )}

      {/* ── RECEIPT ── */}
      <div style={{ overflowX: 'hidden', borderRadius: 4 }}>
        {/* Scale down on small screens, full size on md+ */}
        <div style={{ transformOrigin: 'top center' }} className="flex justify-center scale-[0.78] sm:scale-90 md:scale-100 -mb-[22%] sm:-mb-[10%] md:mb-0">
        <div ref={receiptRef} style={{ fontFamily: 'system-ui,-apple-system,sans-serif', background: '#080d1e', width: 420 }}>

        {/* Top zigzag */}
        <svg width="420" height="14" viewBox="0 0 420 14" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="zg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00a8ff"/>
              <stop offset="100%" stopColor="#39ff9e"/>
            </linearGradient>
          </defs>
          <rect width="420" height="14" fill="url(#zg)" />
          <polygon points="0,14 10,0 20,14 30,0 40,14 50,0 60,14 70,0 80,14 90,0 100,14 110,0 120,14 130,0 140,14 150,0 160,14 170,0 180,14 190,0 200,14 210,0 220,14 230,0 240,14 250,0 260,14 270,0 280,14 290,0 300,14 310,0 320,14 330,0 340,14 350,0 360,14 370,0 380,14 390,0 400,14 410,0 420,14 420,14 0,14" fill="#080d1e" />
        </svg>

        {/* Receipt body */}
        <div style={{ background: '#080d1e', position: 'relative', overflow: 'hidden' }}>

          {/* Watermark */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 0 }}>
            <p style={{ color: 'rgba(0,168,255,0.04)', fontSize: 72, fontWeight: 900, letterSpacing: 4, transform: 'rotate(-30deg)', userSelect: 'none', whiteSpace: 'nowrap' }}>VESTOR</p>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Top gradient bar */}
            <div style={{ height: 4, background: 'linear-gradient(90deg,#00a8ff 0%,#39ff9e 100%)' }} />

            {/* Header with logo */}
            <div style={{ padding: '18px 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/VestorLog.png" alt="Vestor" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'contain' }} />
                <div>
                  <p style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 0.5, margin: 0 }}>VESTOR INVEST</p>
                  <p style={{ ...col(0.4), fontSize: 10, margin: 0 }}>Official Transaction Receipt</p>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 0 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', ...statusStyle }}>
                  {tx.status}
                </div>
                <p style={{ ...col(0.35), fontSize: 10, margin: '0 0 2px' }}>RECEIPT ID</p>
                <p style={{ color: '#00a8ff', fontSize: 11, fontWeight: 700, margin: 0, ...mono }}>{tx.id}</p>
              </div>
            </div>

            {/* Amount */}
            <div style={{ padding: '20px 24px', textAlign: 'center', background: tx.type === 'Credit' ? 'rgba(57,255,158,0.04)' : 'rgba(0,168,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ ...col(0.4), fontSize: 10, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 1 }}>
                {tx.type === 'Credit' ? 'Amount Credited' : 'Amount Withdrawn'}
              </p>
              <p style={{ color: tx.type === 'Credit' ? '#39ff9e' : '#fff', fontSize: 38, fontWeight: 800, lineHeight: 1, letterSpacing: -1, margin: 0 }}>
                ${parseFloat(tx.amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p style={{ ...col(0.3), fontSize: 10, margin: '4px 0 0' }}>US Dollar</p>
              {tx.type === 'Credit' && (
                <p style={{ color: '#39ff9e', fontSize: 11, margin: '8px 0 0', fontWeight: 600 }}>✓ Successfully added to your account</p>
              )}
            </div>

            {/* Details */}
            <div style={{ padding: '4px 24px 8px' }}>
              <Row label="Method" value={tx.method === 'bank' ? 'Bank Wire Transfer' : 'Crypto Withdrawal'} />
              <Row label="Date & Time" value={tx.date} />
              {details.map(([label, value, isMono]) => (
                <Row key={label} label={label} value={value} isMono={!!isMono} />
              ))}
            </div>

            {/* Dashed divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 24px', margin: '4px 0' }}>
              <div style={{ flex: 1, borderTop: '1px dashed rgba(255,255,255,0.1)' }} />
              <span style={{ ...col(0.2), fontSize: 13 }}>✂</span>
              <div style={{ flex: 1, borderTop: '1px dashed rgba(255,255,255,0.1)' }} />
            </div>

            {/* Footer */}
            <div style={{ padding: '12px 24px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#00a8ff', fontSize: 11, fontWeight: 600, margin: 0 }}>vestorinvest.com</p>
                <p style={{ ...col(0.2), fontSize: 10, margin: '2px 0 0' }}>Keep this receipt for your records</p>
              </div>
              <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                {[14,20,10,24,16,8,22,12,18,6,20,14].map((h, i) => (
                  <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: i % 3 === 0 ? '#00a8ff' : i % 3 === 1 ? '#39ff9e' : 'rgba(255,255,255,0.12)' }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom zigzag */}
        <svg width="420" height="14" viewBox="0 0 420 14" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="zg2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00a8ff"/>
              <stop offset="100%" stopColor="#39ff9e"/>
            </linearGradient>
          </defs>
          <rect width="420" height="14" fill="url(#zg2)" />
          <polygon points="0,0 10,14 20,0 30,14 40,0 50,14 60,0 70,14 80,0 90,14 100,0 110,14 120,0 130,14 140,0 150,14 160,0 170,14 180,0 190,14 200,0 210,14 220,0 230,14 240,0 250,14 260,0 270,14 280,0 290,14 300,0 310,14 320,0 330,14 340,0 350,14 360,0 370,14 380,0 390,14 400,0 410,14 420,0 420,0 0,0" fill="#080d1e" />
        </svg>

      </div>
        </div>
      </div>

      {/* Agent notice */}
      {tx.type === 'Credit' ? (
        <div className="flex gap-3 p-4 rounded-xl border" style={{ background: 'rgba(57,255,158,0.06)', borderColor: 'rgba(57,255,158,0.2)' }}>
          <CheckCircle2 size={18} className="text-[#39ff9e] shrink-0 mt-0.5" />
          <div>
            <p className="text-[#39ff9e] font-semibold text-sm mb-1">Account Funded by Vestor Invest</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Your account has been funded by a Vestor Invest agent. The amount has been credited to your wallet and is available for investment immediately. For any queries, contact your agent via live chat.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 p-4 rounded-xl border" style={{ background: 'rgba(250,204,21,0.06)', borderColor: 'rgba(250,204,21,0.2)' }}>
          <AlertCircle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-semibold text-sm mb-1">Action Required</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Share this receipt with your Vestor agent via live chat to complete your transaction. Your agent will verify the payment and credit your wallet. You may also be required to pay any applicable transaction fees before funds are released.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <GlassButton variant="outline" className="flex-1 flex items-center justify-center gap-2" onClick={share}>
          <Share2 size={15} /> Share
        </GlassButton>
        <GlassButton variant="outline" className="flex-1 flex items-center justify-center gap-2" onClick={download}>
          <Download size={15} /> Download
        </GlassButton>
        {onDone && <GlassButton variant="primary" className="flex-1" onClick={onDone}>Done</GlassButton>}
      </div>
    </div>
  )
}

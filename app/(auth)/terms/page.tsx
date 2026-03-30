import { AuthLayout } from '@/components/layouts/auth-layout'

export default function TermsPage() {
  return (
    <AuthLayout title="Terms of Service" subtitle="Last updated: March 2026">
      <div className="space-y-4 text-white/70 text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
        <section>
          <h3 className="text-white font-semibold mb-1">1. Acceptance of Terms</h3>
          <p>By accessing or using Vestor Invest, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
        </section>
        <section>
          <h3 className="text-white font-semibold mb-1">2. Investment Risk</h3>
          <p>Cryptocurrency investments are highly volatile. Past performance does not guarantee future results. You may lose some or all of your invested capital. Invest only what you can afford to lose.</p>
        </section>
        <section>
          <h3 className="text-white font-semibold mb-1">3. Eligibility</h3>
          <p>You must be at least 18 years old and legally permitted to invest in your jurisdiction to use this platform.</p>
        </section>
        <section>
          <h3 className="text-white font-semibold mb-1">4. Account Security</h3>
          <p>You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized access.</p>
        </section>
        <section>
          <h3 className="text-white font-semibold mb-1">5. Prohibited Activities</h3>
          <p>You may not use the platform for money laundering, fraud, market manipulation, or any illegal activity.</p>
        </section>
        <section>
          <h3 className="text-white font-semibold mb-1">6. Termination</h3>
          <p>We reserve the right to suspend or terminate your account at any time for violation of these terms.</p>
        </section>
        <section>
          <h3 className="text-white font-semibold mb-1">7. Contact</h3>
          <p>For questions about these terms, contact us at support@vestorinvest.com</p>
        </section>
      </div>
    </AuthLayout>
  )
}

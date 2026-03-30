import { AuthLayout } from '@/components/layouts/auth-layout'

export default function PrivacyPage() {
  return (
    <AuthLayout title="Privacy Policy" subtitle="Last updated: March 2026">
      <div className="space-y-4 text-white/70 text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
        <section>
          <h3 className="text-white font-semibold mb-1">1. Information We Collect</h3>
          <p>We collect your name, email address, and usage data when you register and use Vestor Invest.</p>
        </section>
        <section>
          <h3 className="text-white font-semibold mb-1">2. How We Use Your Data</h3>
          <p>Your data is used to provide and improve our services, send account notifications, and comply with legal obligations. We never sell your personal data.</p>
        </section>
        <section>
          <h3 className="text-white font-semibold mb-1">3. Data Storage</h3>
          <p>Your data is stored securely using Firebase (Google Cloud). We use industry-standard encryption at rest and in transit.</p>
        </section>
        <section>
          <h3 className="text-white font-semibold mb-1">4. Cookies</h3>
          <p>We use essential cookies for authentication and session management. No third-party advertising cookies are used.</p>
        </section>
        <section>
          <h3 className="text-white font-semibold mb-1">5. Your Rights</h3>
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting support@vestorinvest.com.</p>
        </section>
        <section>
          <h3 className="text-white font-semibold mb-1">6. Third Parties</h3>
          <p>We use Firebase Authentication and Google Analytics. Their respective privacy policies apply to data processed by those services.</p>
        </section>
      </div>
    </AuthLayout>
  )
}

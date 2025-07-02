// src/app/privacy-policy/page.tsx
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen  text-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Privacy Policy</h1>

        <section className="bg-transparent backdrop-blur-sm shadow-md border border-gray-300 p-8 rounded-xl space-y-8 text-base leading-relaxed">
          <p>
            At <strong className="text-gray-800">Primate</strong>, your privacy is our priority. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website.
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal information such as name, email, phone number, and shipping address.</li>
              <li>Payment details via secure payment gateways (we do not store your card info).</li>
              <li>Browsing behavior, device information, and IP address via cookies and analytics.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process and deliver your orders.</li>
              <li>To improve your shopping experience.</li>
              <li>To send order updates, promotional emails, or relevant offers (you can opt out).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">3. Data Protection</h2>
            <p>
              We use industry-standard security practices to protect your data from unauthorized access. Your payment data is encrypted and handled by certified third-party processors.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">4. Sharing Your Information</h2>
            <p>
              We never sell your personal data. We may share data with delivery partners, payment gateways, and analytics tools to ensure service quality — all under strict confidentiality.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">5. Your Rights</h2>
            <p>
              You can access, update, or delete your personal information anytime by contacting us at{' '}
              <a href="mailto:support@primate.com" className="text-red-600 hover:underline">support@primate.com</a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">6. Updates to This Policy</h2>
            <p>
              We may update this policy from time to time. Changes will be posted on this page with an updated effective date.
            </p>
          </div>

          <p className="text-sm text-gray-600 mt-6 text-right">Effective Date: June 17, 2025</p>
        </section>
      </div>
    </div>
  );
}


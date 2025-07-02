export default function ShippingPolicy() {
  return (
    <div className="min-h-screen text-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-600">Shipping Policy</h1>

        <section className="bg-transparent backdrop-blur-sm shadow-md border border-gray-300 p-8 rounded-xl space-y-8 text-base leading-relaxed">
          <p>
            At <strong className="text-gray-800">Primate</strong>, we are committed to delivering your orders quickly and safely. Below are the details of our shipping process and policies.
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">1. Order Processing</h2>
            <p>
              Orders are processed within <strong>1–2 business days</strong> after successful payment confirmation. Processing may take longer during high-volume periods or sales.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">2. Shipping Time & Delivery</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Standard Shipping:</strong> 4–7 business days</li>
              <li><strong>Express Shipping:</strong> 1–3 business days</li>
              <li>Shipping timelines may vary based on your location and courier availability.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">3. Shipping Charges</h2>
            <p>
              Shipping costs are calculated at checkout based on your location and selected delivery method. We may offer free shipping on orders above a certain value, which will be indicated at checkout.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">4. Tracking Information</h2>
            <p>
              Once your order is shipped, you will receive a tracking number via email or SMS. You can use it to track the status of your delivery in real time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">5. Delays & Exceptions</h2>
            <p>
              While we strive to meet our delivery timelines, delays may occur due to unforeseen factors like weather conditions, courier issues, or public holidays. We appreciate your patience during such times.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">6. Undeliverable Packages</h2>
            <p>
              If a package is returned to us due to incorrect address, refusal, or failed delivery attempts, we will contact you to arrange re-shipment (additional charges may apply).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-red-600">7. Questions or Support</h2>
            <p>
              If you have questions about your shipment, please contact us at{' '}
              <a href="mailto:support@primate.com" className="text-red-600 hover:underline">support@primate.com</a>.
            </p>
          </div>

          <p className="text-sm text-gray-600 mt-6 text-right">Effective Date: June 17, 2025</p>
        </section>
      </div>
    </div>
  );
}

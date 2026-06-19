"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-emerald-700 mb-2">
        Privacy Policy
      </h1>

      <p className="text-gray-600 mb-8">
        Your privacy is important to us. This policy explains how TailorPro
        collects, uses, and protects your information.
      </p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p>
            We collect only the information necessary to provide our services,
            including:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>User details such as name, email, phone number</li>
            <li>Customer and order information entered by the user</li>
            <li>Measurements, reference images, and special instructions</li>
            <li>Payment details such as advance and balance amounts (no card data)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            2. How We Use Your Information
          </h2>
          <p>
            The collected information is used only to:
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Manage orders, customers, and deliveries</li>
            <li>Provide staff access and role-based permissions</li>
            <li>Improve application performance and user experience</li>
            <li>Ensure secure authentication and access control</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            3. Data Security
          </h2>
          <p>
            We implement industry-standard security measures to protect your
            data. Sensitive actions such as login are secured using OTP or
            encrypted credentials. Only authorized users can access your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            4. Data Sharing
          </h2>
          <p>
            We do not sell, trade, or share your data with third parties.
            All information remains private to your boutique or store.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            5. Staff Access & Responsibility
          </h2>
          <p>
            Staff accounts are created by the store owner and have limited access.
            The owner is responsible for managing staff permissions and data usage.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            6. Data Retention
          </h2>
          <p>
            Your data is retained as long as your account is active. You may
            request data removal or account deletion at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            7. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be reflected on this page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            8. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy or your data,
            please contact us at:
          </p>
          <p className="mt-1 font-medium text-emerald-700">
            support@tailorpro.app
          </p>
        </section>
      </div>
    </div>
  );
}

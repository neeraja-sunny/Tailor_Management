"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="no-print bg-gray-50 border-t border-gray-200 mt-24 px-6 py-16">
      <div className="max-w-7xl mx-auto">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* BRAND */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/dressmaker.png"
                alt="TailorPro Logo"
                className="h-12 w-12 object-contain"
              />
              <h3 className="text-3xl font-semibold text-gray-900">
                Tailor<span className="text-emerald-600">Pro</span>
              </h3>
            </div>

            <p className="text-gray-600 leading-relaxed font-medium max-w-md text-lg">
              The modern operating system for tailors, boutiques, and fashion businesses.
              Simplify orders, delight customers, and grow faster.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="text-xl font-medium text-gray-900 mb-4">
              Product
            </h4>
            <ul className="space-y-3 text-gray-600 font-medium">
              <li><Link href="/features" className="hover:text-emerald-600 transition">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-emerald-600 transition">Pricing</Link></li>
              <li><Link href="/testimonials" className="hover:text-emerald-600 transition">Testimonials</Link></li>
              <li><Link href="/auth" className="hover:text-emerald-600 transition">Get Started</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-xl font-medium text-gray-900 mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-gray-600 font-medium">
              <li><Link href="/about" className="hover:text-emerald-600 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-600 transition">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-emerald-600 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-600 transition">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-7 border-2 border-gray-200 h-full flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Ready to modernize your store?
                </h4>
              
              </div>

              <Link
                href="/auth"
                className="inline-flex items-center justify-center w-full border-2 border-emerald-600 text-emerald-600 rounded-full px-4 py-2 font-medium hover:bg-gray-700 transition"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-12 border-t border-gray-400" />
  
          <span className="text-center justify-center font-semibold md:items-center">
            © {new Date().getFullYear()} TailorPro. All rights reserved.
          </span>

      </div>
    </footer>
  );
}

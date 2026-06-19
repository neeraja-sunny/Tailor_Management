"use client";

export default function FAQPage() {
  const faqs = [
    {
      q: "What is TailorPro?",
      a: "TailorPro is a smart boutique and tailoring management system that helps you manage customers, orders, measurements, payments, staff, and delivery schedules — all in one place."
    },
    {
      q: "Who can use TailorPro?",
      a: "TailorPro is designed for boutique owners, tailoring shops, and fashion studios. Owners can manage everything, while staff members can handle orders and customers."
    },
    {
      q: "What is the difference between Owner and Staff access?",
      a: "The owner has full access including dashboard analytics and staff management. Staff members can add and manage orders and customers but cannot access business analytics or staff settings."
    },
    {
      q: "How many orders can be taken per day?",
      a: "For quality control, TailorPro recommends a maximum of 15 orders per day. The Smart Calendar visually alerts you when order limits are reached."
    },
    {
      q: "Can I track order progress?",
      a: "Yes. Each outfit has its own status such as Accepted, Cutting, Stitching, Finishing, and Completed — making order tracking simple and transparent."
    },
    {
      q: "How are customer measurements stored?",
      a: "Measurements are securely stored digitally and can be reused for future orders, reducing errors and saving time."
    },
    {
      q: "Can I record advance payments?",
      a: "Yes. You can record partial payments as advance and automatically track the remaining balance for each order."
    },
    {
      q: "Is staff login secure?",
      a: "Yes. Staff accounts are created by the owner and secured using OTP or password-based authentication."
    },
    {
      q: "Can I upload reference images or audio notes?",
      a: "Absolutely. You can attach reference images, inspiration links, and audio instructions to each outfit for better clarity."
    },
    {
      q: "Is TailorPro mobile-friendly?",
      a: "Yes. TailorPro is fully responsive and works smoothly on mobile phones, tablets, and desktops."
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-emerald-700 mb-2">
        Frequently Asked Questions
      </h1>

      <p className="text-gray-600 mb-8">
        Everything you need to know about using TailorPro effectively.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="bg-white border rounded-lg p-4 group shadow-sm"
          >
            <summary className="cursor-pointer font-semibold text-gray-800 flex justify-between items-center">
              {faq.q}
              <span className="text-emerald-600 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>

            <p className="mt-3 text-gray-600 leading-relaxed">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}

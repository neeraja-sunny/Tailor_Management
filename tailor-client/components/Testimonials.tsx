"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  review: string;
};

const testimonials: Testimonial[] = [
  { id: 1, name: "Rahi", role: "Boutique Owner", avatar: "/avatars/1.jpg", review: "My customers love the order tracking. It has reduced so many phone calls. Highly recommended!"},
  { id: 2, name: "Sanjaya", role: "Fashion Designer", avatar: "/avatars/2.jpg", review: "Saved me 10 hours a week! The AI voice feature is a game-changer for my shop."},
  { id: 3, name: "Amber", role: "Payroll Manager", avatar: "/avatars/3.jpg", review: "Managing staff wages was a nightmare. TailorPro automated it perfectly. My team is happier." },
  { id: 4, name: "Arjun", role: "Tailor", avatar: "/avatars/4.jpg", review: "The low stock alerts for my fabrics are incredibly useful. I can reorder before I run out." },
  { id: 5, name: "Raveen", role: "Studio Owner", avatar: "/avatars/6.jpg", review: "Got to know daily Work Reports & Tailor Performance Tracking" },
];

export default function Testimonials() {
  const [active, setActive] = useState(2);

  return (
    <section className="relative py-20 overflow-hidden">
   
      <div className="max-w-7xl mx-auto mb-10 md:mb-20">
        <h2 className="text-4xl px-6 md:text-5xl font-semibold text-black leading-snug">
          Listen to what
          <br />
          our Latest Clients say
        </h2>
      </div>

      {/* Avatars */}
      <div className="relative flex items-center justify-center gap-3 md:gap-10">
        {testimonials.map((t, index) => {
          const isActive = index === active;

          return (
            <button
              key={t.id}
              onClick={() => setActive(index)}
              className={`relative rounded-full transition-all duration-300
                ${
                  isActive
                    ? "scale-125 z-10"
                    : "scale-90 opacity-60 hover:opacity-90"
                }
              `}
            >
              <div
                className={`relative rounded-full overflow-hidden 
                ${isActive ? "bg-emerald-700 p-2" : "bg-transparent"}`}
              >
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={180}
                  height={180}
                  className="rounded-full object-cover"
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Name */}
      <div className="mt-10 text-center">
        <p className="text-lg font-medium text-gray-900">
          {testimonials[active].role} – {testimonials[active].name}
        </p>
        <p className="text-md font-normal text-gray-900">{testimonials[active].review}</p>
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center gap-3">
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={`h-3 w-3 rounded-full transition-all
              ${i === active ? "bg-emerald-600" : "bg-gray-400"}
            `}
          />
        ))}
      </div>
    </section>
  );
}

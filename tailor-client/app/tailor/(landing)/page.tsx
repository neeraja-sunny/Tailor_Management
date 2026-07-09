"use client";

import Link from "next/link";
import Waves from "@/components/Waves";
import Image from "next/image";
import Testimonials from "@/components/Testimonials";

const HeroLine = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="flex items-center justify-center gap-3">
    {icon && <span className="inline-flex items-center">{icon}</span>}
    <span>{children}</span>
  </div>
);

export default function Page() {
  const logos = [
    "/logos/burberry.png",
    "/logos/chanel.png",
    "/logos/dior.png",
    "/logos/fendi.png",
    "/logos/louis.png",
    "/logos/polo.png",
    "/logos/prada.png",
    "/logos/versace.png"
  ];

  const repeated = [...logos, ...logos, ...logos];

const STAR = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    viewBox="0 0 16 16"
    className="mb-4 text-emerald-600"
  >
    <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1" />
  </svg>
);



  return (
    <div className="relative min-h-screen overflow-hidden pt-16">
      {/* <Waves
        lineColor="#D3D3D3"
        backgroundColor="rgba(255,255,255,0.06)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      /> */}

      {/* content above waves */}
      <div className="relative z-10 flex flex-col min-h-screen">

        <section className="flex-1 flex items-center justify-center px-6 pt-10 md:pt-14 pb-16 overflow-x-hidden">
  <div className="relative w-full max-w-7xl mx-auto">

    {/* LEFT ROTATING LIST — DESKTOP ONLY (UNCHANGED) */}
    <div className="absolute -left-5 top-24 hidden lg:flex flex-col items-start text-gray-800 font-medium text-xl">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        fill="currentColor"
        viewBox="0 0 16 16"
        className="mb-4 text-emerald-600"
      >
        <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1" />
      </svg>

      <div className="relative overflow-hidden h-[128px]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10" />
        <div className="animate-listRotate space-y-2">
          <span className="block">Clothing</span>
          <span className="block">Embroidery</span>
          <span className="block">Tailoring</span>
          <span className="block">Bespoke Services</span>
          <span className="block">Clothing</span>
          <span className="block">Embroidery</span>
          <span className="block">Tailoring</span>
          <span className="block">Bespoke Services</span>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE TEXT — DESKTOP ONLY (UNCHANGED) */}
    <div className="absolute right-0 top-12 hidden lg:block max-w-xs text-md text-gray-700">
      <span className="font-semibold text-emerald-600">
        Trusted by 360+ fashion boutique owners
      </span>
      <span className="font-semibold">
        {" "}– from independent tailors and designer studios to modern fashion houses.
      </span>
    </div>

    {/* CENTER CONTENT */}
    <div className="text-center max-w-4xl mx-auto px-2">
      <h1 className="text-[clamp(2.2rem,6vw,4.5rem)] md:text-7xl font-bold leading-tight text-black space-y-6">

        <div className="lg:-translate-x-24">
          Master Your Craft, and
        </div>

        <div>
          Simplify
        </div>

        <div className="lg:translate-x-24">
          <span className="text-emerald-600">Your Store</span> with Tailor
          <span className="text-emerald-600">Pro</span>
        </div>

      </h1>

      {/* CTA */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/auth"
          className="inline-flex items-center gap-3 bg-black text-white rounded-full px-8 py-3 text-lg font-medium hover:bg-gray-900 transition"
        >
          Join Us Now
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  </div>

  {/* BOTTOM DECORATIVE SVG — HIDDEN ON MOBILE */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    fill="currentColor"
    viewBox="0 0 16 16"
    className="hidden lg:block mb-5 mr-20 text-emerald-700"
  >
    <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828z" />
  </svg>

  <style>{`
    @keyframes listRotate {
      from { transform: translateY(0); }
      to { transform: translateY(-50%); }
    }
    .animate-listRotate {
      animation: listRotate 10s linear infinite;
    }
  `}</style>
</section>

        
{/* <section className="flex-1 flex items-center justify-center px-6 pt-28 pb-16">
  <div className="relative w-full max-w-7xl mx-auto">

  <div className="absolute -left-5 top-24 hidden lg:flex flex-col items-start text-gray-800 font-medium text-xl">

  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    fill="currentColor"
    viewBox="0 0 16 16"
    className="mb-4 text-emerald-600"
  >
  <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1"/>
  </svg>

  <div className="relative overflow-hidden h-[128px]">

     <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10" />
    
    <div className="animate-listRotate space-y-2">
      <span className="block">Clothing</span>
      <span className="block">Embroidery</span>
      <span className="block">Tailoring</span>
      <span className="block">Bespoke Services</span>

      <span className="block">Clothing</span>
      <span className="block">Embroidery</span>
      <span className="block">Tailoring</span>
      <span className="block">Bespoke Services</span>
    </div>
  </div>
</div>

<style>{`
@keyframes listRotate {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}
.animate-listRotate {
  animation: listRotate 10s linear infinite;
}
`}</style>


    
    <div className="absolute right-0 top-12 hidden lg:block max-w-xs text-md text-gray-700">
      <span className="font-semibold text-emerald-600">
      Trusted by 360+ fashion boutique owners
      </span>
      <span className="font-semibold">
        {" "}- from independent tailors and designer studios to modern fashion houses.
      </span>
    </div>

    <div className="text-center max-w-4xl mx-auto">
<h1 className="text-5xl md:text-7xl font-bold leading-tight text-black space-y-6">
  <div className="-translate-x-24">
    Master Your Craft, and
  </div>

  <div>
    Simplify
  </div>

  <div className="translate-x-24">
    <span className="text-emerald-600">Your Store</span> with Tilor
    <span className="text-emerald-600">Pro</span>
  </div>
</h1>

      <div className="mt-10">
        <Link
          href="/auth"
          className="inline-flex items-center gap-3 bg-black text-white rounded-full px-8 py-3 text-lg font-medium hover:bg-gray-900 transition"
        >
          Join Us Now
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
        </Link>
      </div>
    </div>
  </div>
 <svg 
 xmlns="http://www.w3.org/2000/svg" 
 width="36" 
 height="36" 
 fill="currentColor" 
 viewBox="0 0 16 16" 
 className="mb-5 mr-20 text-emerald-700">
  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
  </svg>
</section> */}


        <section className="w-full bg-transparent py-8">
          <div className="relative overflow-hidden">
            <div
              className="flex items-center gap-8 will-change-transform"
              style={{
                animation: "marquee 24s linear infinite",
              }}
            >
              {repeated.map((src, idx) => (
                <div key={`${src}-${idx}`} className="flex-shrink-0">
                  <img src={src} alt={`partner-${idx}`} className="h-12 md:h-16 object-contain" />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* THIRD SECTION */}
<section className="relative z-10 px-6 py-12">
  <div className="max-w-8xl mx-auto">

    {/* TOP CARD GRID */}
    <div className="bg-gray-50 rounded-[40px] p-12 md:p-30">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Column 1 */}
      <div className="flex flex-col gap-6">
      <div className="bg-gray-200 rounded-2xl h-60 relative overflow-hidden">
        <img
        src="/landing/image2.png"
        alt="Customer History"
        className="h-full w-full object-cover"
        />
      </div>


          <div className="bg-gray-200 rounded-2xl p-5 text-lg font-semibold">
            Store customer measurements, preferences, and order history in one secure place, always ready when you need them.
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6">
          <div className="bg-gray-200 rounded-2xl p-5 text-lg font-semibold">
            Designed to help tailors and fashion boutiques work faster, stay organized, and deliver a premium experience every time.
          </div>

          <div className="bg-gray-200 rounded-2xl h-56 relative overflow-hidden">
  <img
    src="/landing/image5.png"
    alt="All in one tailoring app"
    className="h-full w-full object-cover"
  />
</div>

        </div>

        {/* Column 3 */}
        <div className="bg-gray-200 rounded-2xl min-h-[280px] relative overflow-hidden">
  <img
    src="/landing/image4.png"
    alt="Tailoring management dashboard"
    className="h-full w-full object-cover"
  />
</div>

        {/* Column 4 */}
        <div className="flex flex-col gap-6">
<div className="bg-gray-200 rounded-2xl h-60 relative overflow-hidden">
  <img
    src="/landing/image6.png"
    alt="Seamless tailoring experience"
    className="h-full w-full object-cover"
        />
        </div>

          <div className="bg-gray-200 rounded-2xl p-5 text-lg font-semibold">
            Seamless order creation, instant updates, and clear tracking - so your customers leave saying,
            “Whoa, that was smooth.”
          </div>
        </div>
      </div>
    </div>

    {/* MIDDLE BAR */}
    <div
  className="
    mt-5 bg-gray-50 rounded-full px-4 py-4
    flex flex-col gap-4 items-center
    md:flex-row md:gap-0 md:items-center md:justify-between
  "
>
  <span className="text-emerald-700 px-6 py-3 md:px-8 md:py-4 rounded-full text-md font-medium border-2 border-emerald-700">
    Why Us
  </span>

  <span className="text-lg md:text-xl font-medium text-gray-800 hover:underline cursor-pointer text-center">
    Trusted on Communities →
  </span>

  <span className="border-2 border-emerald-700 text-emerald-700 px-6 py-3 md:px-8 md:py-4 rounded-full text-md font-medium">
    Our Features
  </span>
</div>

    {/* <div className="mt-5 bg-gray-50 rounded-full px-6 py-6 flex items-center justify-between">
      <span className="text-emerald-700 px-8 py-4 rounded-full text-md font-medium border-2 border-emerald-700">
        Why Us 
      </span>

      <span className="text-xl font-medium text-gray-800 hover:underline cursor-pointer">
        Trusted on Communities →
      </span>

      <span className="border-2 border-emerald-700 text-emerald-700 px-8 py-4 rounded-full text-md font-medium">
        Our Features
      </span>
    </div> */}
  

<div className="relative mt-5 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-gray-50 rounded-[40px] p-6 md:p-12 lg:p-30 overflow-hidden">
  
  {/* LEFT – FLOATING PILLS (DESKTOP ONLY) */}
  <div className="hidden lg:block">
    <div className="relative min-h-[580px]">

      {/* 1 */}
      <div className="absolute top-4 left-8 flex items-center gap-3">
        <span className="rounded-full bg-emerald-300 text-black px-4 py-2 font-medium text-md">
          Flexible Registration
        </span>
        {STAR}
      </div>

      {/* 2 */}
      <div className="absolute top-24 left-28 flex items-center gap-3">
        <span className="rounded-full bg-gray-700 text-white px-4 py-2 font-medium text-md">
          Simplified order creation
        </span>
        {STAR}
      </div>

      {/* 3 */}
      <div className="absolute top-14 right-12 flex items-center gap-3">
        <span className="rounded-full bg-emerald-300 text-black px-4 py-2 font-medium text-md">
          Track Daily Revenue
        </span>
        {STAR}
      </div>

      {/* 4 */}
      <div className="absolute top-44 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <span className="rounded-full bg-gray-700 text-white px-4 py-2 font-medium text-md">
          Get Instant reminders on Whatsapp
        </span>
        {STAR}
      </div>

      {/* 5 */}
      <div className="absolute top-64 left-20 flex items-center gap-3">
        <span className="rounded-full bg-emerald-300 text-black px-4 py-2 font-medium text-md">
          Automated communication
        </span>
        {STAR}
      </div>

      {/* 6 */}
      <div className="absolute top-80 right-20 flex items-center gap-3">
        <span className="rounded-full bg-gray-700 text-white px-4 py-2 font-medium text-md">
          Enhance customer engagement
        </span>
        {STAR}
      </div>

      {/* TailorPro Floating Pill */}
      <div className="absolute top-[200px] right-[-78px] z-10">
        <span className="flex items-center gap-2 rounded-full bg-emerald-300 text-black px-6 py-2 font-medium text-xl border-2 border-gray-700 shadow-lg">
          TailorPro
          <img
            src="/dressmaker.png"
            alt="TailorPro Logo"
            className="h-8 w-8 object-contain"
          />
        </span>
      </div>

      {/* 7 */}
      <div className="absolute bottom-28 left-12 flex items-center gap-3">
        <span className="rounded-full bg-gray-700 text-white px-4 py-2 font-medium text-md">
          Realtime Order Tracking
        </span>
        {STAR}
      </div>

      {/* 8 */}
      <div className="absolute bottom-16 right-10 flex items-center gap-3">
        <span className="rounded-full bg-emerald-300 text-black px-4 py-2 font-medium text-md">
          Access Anywhere, Anytime
        </span>
        {STAR}
      </div>

      {/* 9 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <span className="rounded-full bg-gray-700 text-white px-4 py-2 font-medium text-md">
          Smart billing and invoice generation
        </span>
        {STAR}
      </div>

    </div>
  </div>

  {/* RIGHT – CONTENT (ALWAYS VISIBLE) */}
  <div>
    <p className="text-2xl md:text-4xl leading-normal tracking-normal font-semibold text-gray-950 mb-5">
      Modern problems need
      <span> Modern solutions</span>
    </p>

    <div className="bg-gray-200 rounded-3xl min-h-[260px] md:min-h-[500px] lg:h-80 flex items-center justify-center overflow-hidden">

      <img
        src="/landing/image1.png"
        alt="Modern tailoring solutions"
        className="h-full w-full object-cover rounded-3xl"
      />
    </div>
  </div>
</div>

  </div>
</section>



<section className="relative bg-white rounded-[40px] px-6 py-14 md:px-6 md:py-14">

  {/* Heading */}
  <div className="max-w-7xl mx-auto text-center mb-16">
    <h2 className="text-3xl md:text-5xl font-semibold text-gray-950 leading-loose tracking-wide">
      93% of Organisers using TailorPro
      <br />
      <span className="inline-flex right-10 gap-4">
      
        hit their Registration goals.

        <svg xmlns="http://www.w3.org/2000/svg" className="right-20 text-emerald-600" width="52" height="52" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.01 4.555 4.005 7.11 8.01 9.665 4.005 12.22 0 9.651l4.005-2.555L0 4.555 4.005 2zm-4.026 8.487 4.006-2.555 4.005 2.555-4.005 2.555zm4.026-3.39 4.005-2.556L8.01 4.555 11.995 2 16 4.555 11.995 7.11 16 9.665l-4.005 2.555z"/>
        </svg>
      </span>
      <br />
      Let&apos;s make you one of them.
    </h2>
  </div>

  {/* Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {/* Card 1 */}
    <div className="bg-zinc-200 border-2 border-zinc-300 rounded-3xl p-8 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <img src="/scissors.png" alt="Mascot" className="h-16 mt-2" />
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
  <path d="M11.5 4v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m0 6.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
</svg>
      </div>
      <p className="text-xl font-normal text-black mt-5">
        60 hours saved per order
        <br />
        using TailorPro.
      </p>
    </div>

    {/* Card 2 */}
    <div className="bg-zinc-200 border-2 border-zinc-300 rounded-3xl p-8 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <img src="/sewingmachine.png" alt="Mascot" className="h-24" />
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="m8 2.42-.717-.737c-1.13-1.161-3.243-.777-4.01.72-.35.685-.451 1.707.236 3.062C4.16 6.753 5.52 8.32 8 10.042c2.479-1.723 3.839-3.29 4.491-4.577.687-1.355.587-2.377.236-3.061-.767-1.498-2.88-1.882-4.01-.721zm-.49 8.5c-10.78-7.44-3-13.155.359-10.063q.068.062.132.129.065-.067.132-.129c3.36-3.092 11.137 2.624.357 10.063l.235.468a.25.25 0 1 1-.448.224l-.008-.017c.008.11.02.202.037.29.054.27.161.488.419 1.003.288.578.235 1.15.076 1.629-.157.469-.422.867-.588 1.115l-.004.007a.25.25 0 1 1-.416-.278c.168-.252.4-.6.533-1.003.133-.396.163-.824-.049-1.246l-.013-.028c-.24-.48-.38-.758-.448-1.102a3 3 0 0 1-.052-.45l-.04.08a.25.25 0 1 1-.447-.224l.235-.468ZM6.013 2.06c-.649-.18-1.483.083-1.85.798-.131.258-.245.689-.08 1.335.063.244.414.198.487-.043.21-.697.627-1.447 1.359-1.692.217-.073.304-.337.084-.398"/>
</svg>
      </div>
      <p className="text-xl font-normal text-black">
        2x Sales Increased
        <br />
        per order through TP.
      </p>
    </div>

    {/* Card 3 */}
    <div className="bg-zinc-200 border-2 border-zinc-300 rounded-3xl p-8 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <img src="/thread.png" alt="Mascot" className="h-20" />
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
  <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/>
</svg>
      </div>
      <p className="text-xl font-normal text-black mt-3">
        20+ Years Tailoring Tech Experience
      </p>
    </div>
  </div>
</section>

<Testimonials />




      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); } /* adjust depending on repeats */
        }

        /* Improve marquee responsiveness: slow on mobile */
        @media (max-width: 640px) {
          div[style*="animation: marquee"] {
            animation-duration: 40s !important;
          }
        }
      `}</style>
    </div>
  );
}

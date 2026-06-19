"use client";

import Link from "next/link";
import MainHeader from "@/components/mainHeader";
import MainFooter from "@/components/MainFooter";
import ProductSection from "@/components/ProductSection";
import { motion, useMotionValue, useTransform } from "framer-motion";
// import LiquidEther from "@/components/LiquidEther";
import ParallaxItem from "@/components/ParallaxItem";
import styles from "./bubble.module.css";
import { useEffect, useState } from "react";
import IntroSplash from "@/components/IntroSplash";






export default function MainLanding() {

  // ✅ Hooks MUST be inside the component
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const x = useTransform(mouseX, [0, 1], ["-1.5%", "1.5%"]);
  const y = useTransform(mouseY, [0, 1], ["-1.5%", "1.5%"]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })

      // Trigger a small scroll event after scrolling
      setTimeout(() => {
        window.dispatchEvent(new Event('scroll'))
      }, 50)

      // Update URL hash
      history.replaceState(null, '', id === 'hero' ? '/' : `#${id}`)
    }
  }


    const scrollToSectionmax = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return

  const yOffset = window.innerHeight * 0.9 // 🔥 tune this
  const y =
    el.getBoundingClientRect().top +
    window.pageYOffset +
    yOffset

  window.scrollTo({
    top: y,
    behavior: 'smooth',
  })

  // update URL
  history.replaceState(null, '', id === 'hero' ? '/' : `#${id}`)
}




const [showSplash, setShowSplash] = useState(true)

useEffect(() => {
  const t = setTimeout(() => {
    setShowSplash(false)
  }, 60)

  return () => clearTimeout(t)
}, [])







  return (

    
    
    <div
      className="relative min-h-screen"
      onMouseMove={(e) => {
        if (window.innerWidth < 768) return;
        mouseX.set(e.clientX / window.innerWidth);
        mouseY.set(e.clientY / window.innerHeight);
      }}

    >


<IntroSplash show={showSplash} logoSrc="/images/Loomiz white.png" brandGreen="#046C4E" />

      {/* FIXED INTERACTIVE BACKGROUND */}
      <div className="fixed inset-0 -z-20 pointer-events-none bg-[#FCF4E1]">
        {/* <LiquidEther
          mouseForce={4}
          cursorSize={210}
          viscous={5}
          // colors={["#f9f46c","#17d96b","#acd8a6"]}
          colors={["#fbdf93","#fbeac6","#fff9eb"]}
          autoDemo
          autoSpeed={0.1}
          autoIntensity={2.1}
          isBounce
          resolution={0.75}
        /> */}
      </div>



      <MainHeader />

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6" id="hero">
        <div className="max-w-5xl text-center" >
          <h1 className="text-[clamp(2.2rem,6vw,4.5rem)]  leading-tight text-[#0B1C2D] font-PlayfairDisplay">
            One Platform to
            <br />
            <span className="text-[#046C4E]">Run, Sell & Grow</span>
            <br />
            Your Tailoring Business
          </h1>

          <p className="mt-6 text-md md:text-lg lg:text-lg text-gray-700 max-w-2xl  mx-auto font-Poppins">
            TailorPro combines tailoring management, ecommerce,
            and social presence — built for modern fashion businesses.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="#products"
              className="rounded-xl bg-[#046C4E] text-[#FCF4E1] text-sm md:text-md lg:text-lg hover:bg-[#0B1C2D] transition px-8 py-3 font-medium relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent font-Poppins"
              onClick={() => scrollToSectionmax('tailor')}
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      {/* PRODUCT SECTIONS */}

      <ProductSection

        title="Tailor Pro"
        id="tailor"
        subtitle="Manage orders, customers, measurements and production effortlessly."
        images={[
          "/images/tailor1.png",
          "/images/tailor2.png",
          "/images/tailor3.png",
        ]}
        link="/tailor"
        bg="#046C4E"
        headingcolor="#FCF4E1"
        paracolor="#FCF4E1"
        buttoncolor="#FCF4E1"
        hovercolor="#FCF4E1"
        texthover="#046C4E"
        parallaxImages={[

                      {
    src: "/images/bgg white.png",
    speed: 0.02,
    layer: "back",
    className: "top-[0%] right-[0%] w-[100rem] z-[-10] opacity-10"
  },
          {
            src: "/images/thread.png",
            speed: 0.1,
            className: `
      top-[99%]
      md:top-[99%]
      lg:top-[90%]
      left-[30%]
      md:left-[20%]
      lg:left-[30%]
      w-[12rem]
      md:w-[14rem]
      lg:w-[18rem]
      opacity-100
      rotate-[-60deg]
      `
          },
          {
            src: "/images/scissors.png",
            speed: 0.6,
            className: `
      top-[100%]
      left-[50%]
      md:left-[60%]
      lg:left-[70%]
      w-[20rem]
      md:w-[25rem]
      lg:w-[30rem]
      opacity-100
      rotate-[900deg]
      `,
          },
          {
            src: "/images/Ruler.png",
            speed: 0.6,
            className: `
      top-[150%]
      right-[50%]
      md:right-[60%]
      lg:right-[70%]
      w-[20rem]
      md:w-[25rem]
      lg:w-[30rem]
      opacity-70
      rotate-[-30deg]
      `,
          },
        ]}
      />

      <ProductSection
        title="Store"
        id="store"
        subtitle="Launch your fashion ecommerce store with inventory and payments built-in."
        images={[
          "/images/store1.png",
          "/images/store2.png",
          "/images/store3.png",
        ]}
        link="/store"
        bg="#FCF4E1"
        headingcolor="#0B1C2D"
        paracolor="#0B1C2D"
        buttoncolor="#0B1C2D"
        hovercolor="#0B1C2D"
        texthover="#FCF4E1"

        parallaxImages={[


                      {
    src: "/images/bgg white.png",
    speed: 0.02,
    layer: "back",
    className: "top-[0%] right-[0%] w-[100rem] z-[-10] opacity-60"
  },



          
          {
            src: "/images/shopping bag.png",
            speed: 0.1,
            className: `
      top-[120%]
      md:top-[99%]
      lg:top-[99%]
      left-[30%]
      md:left-[20%]
      lg:left-[30%]
      w-[12rem]
      md:w-[14rem]
      lg:w-[16rem]
      opacity-100
      rotate-[-60deg]
      `
          },
          {
            src: "/images/cart.png",
            speed: 0.3,
            className: `
      top-[170%]
      md:top-[150%]
      lg:top-[150%]
      left-[50%]
      md:left-[60%]
      lg:left-[70%]
      w-[20rem]
      md:w-[25rem]
      lg:w-[30rem]
      opacity-100
      rotate-[-900deg]
      `,
          },
          {
            src: "/images/sale.png",
            speed: 0.4,
            className: `
      top-[200%]
      md:top-[199%]
      lg:top-[190%]
      right-[50%]
      md:right-[60%]
      lg:right-[70%]
      w-[20rem]
      md:w-[25rem]
      lg:w-[30rem]
      opacity-100
      rotate-[-90deg]
      `,
          },
        ]}

      />

      <ProductSection
        title="Social"
        id="social"
        subtitle="Showcase designs, connect with customers and grow your brand socially."
        images={[
          "/images/social1.png",
          "/images/social2.png",
          "/images/social3.png",
        ]}
        link="/social"
        bg="#046C4E"
        headingcolor="#FCF4E1"
        paracolor="#FCF4E1"
        buttoncolor="#FCF4E1"
        hovercolor="#FCF4E1"
        texthover="#046C4E"

        parallaxImages={[

            {
    src: "/images/bgg white.png",
    speed: 0.02,
    layer: "back",
    className: "top-[0%] right-[0%] w-[100rem] z-[-10] opacity-10"
  },

          {
            src: "/images/like2.png",
            speed: 0.1,
            className: `
      top-[160%]
      md:top-[140%]
      lg:top-[90%]
      left-[30%]
      md:left-[20%]
      lg:left-[30%]
      w-[12rem]
      md:w-[14rem]
      lg:w-[18rem]
      opacity-100
      rotate-[-60deg]
      `
          },
          {
            src: "/images/comment.png",
            speed: 0.2,
            className: `
      top-[190%]
      md:top-[165%]
      lg:top-[200%]
      left-[50%]
      md:left-[60%]
      lg:left-[70%]
      w-[20rem]
      md:w-[25rem]
      lg:w-[30rem]
      opacity-100
      rotate-[900deg]
      `,
          },
          {
            src: "/images/hashtag.png",
            speed: 0.3,
            className: `
      top-[270%]
      md:top-[260%]
      lg:top-[340%]
      right-[50%]
      md:right-[60%]
      lg:right-[70%]
      w-[20rem]
      md:w-[25rem]
      lg:w-[30rem]
      opacity-100
      rotate-[-90deg]
      `,
          },
        ]}
      />

      <MainFooter />
    </div>
  );
}
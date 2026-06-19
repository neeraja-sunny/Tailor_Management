'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import OptimizedReveal from '@/components/OptimizedReveal'
import SpotlightLinkButton from './SpotlightLinkButton'

gsap.registerPlugin(ScrollTrigger)

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

interface ProductSectionProps {
  title: string
  subtitle: string
  images: string[]
  link: string
  reverse?: boolean
  id?: string
  parallaxImages?: ParallaxImage[]
  bg: string
  headingcolor: string
  paracolor: string
  buttoncolor: string
  hovercolor: string
  texthover: string
}

interface ParallaxImage {
  src: string
  className: string
  speed: number
  layer?: 'back' | 'front'
}

export default function ProductSection({
  title,
  subtitle,
  link,
  reverse = false,
  id,
  parallaxImages = [],
  bg,
  headingcolor,
  paracolor,
  buttoncolor,
  hovercolor,
  texthover,
}: ProductSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const parallaxRefs = useRef<HTMLDivElement[]>([])

  parallaxRefs.current = []

  const addParallaxRef = (el: HTMLDivElement | null) => {
    if (el && !parallaxRefs.current.includes(el)) {
      parallaxRefs.current.push(el)
    }
  }

  useEffect(() => {
  if (!containerRef.current || !parallaxRefs.current.length) return

  const elements = parallaxRefs.current

  const speeds = elements.map(el => Number(el.dataset.speed) || 0.15)

  gsap.set(elements, {
    willChange: 'transform',
    force3D: true,
    transformPerspective: 1000,
  })

  const ySetters = elements.map(el =>
    gsap.quickSetter(el, 'y', 'px')
  )

  const rSetters = elements.map(el =>
    gsap.quickSetter(el, 'rotation', 'deg')
  )

  let active = false
  let lastScroll = -1

  const update = () => {
    if (active) {
      const scroll = window.scrollY

      if (scroll !== lastScroll) {
        for (let i = 0; i < elements.length; i++) {
          const speed = speeds[i]

          ySetters[i](-scroll * speed)
          rSetters[i](scroll * speed * 0.12) // 🔥 subtle natural rotation
        }

        lastScroll = scroll
      }
    }

    requestAnimationFrame(update)
  }

  requestAnimationFrame(update)

  const st = ScrollTrigger.create({
    trigger: containerRef.current,
    start: 'top bottom',
    end: 'bottom top',
    onEnter: () => (active = true),
    onEnterBack: () => (active = true),
    onLeave: () => (active = false),
    onLeaveBack: () => (active = false),
  })

  return () => {
    st.kill()
    active = false
  }
}, [])


  return (
    <div
      ref={containerRef}
      className="relative h-[350vh]"
      style={{ backgroundColor: bg }}
      id={id}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {parallaxImages
            .filter(p => p.layer === 'back')
            .map((img, i) => (
              <div
                key={i}
                ref={addParallaxRef}
                data-speed={img.speed}
                className={`parallax-layer absolute ${img.className}`}
              >
                <img
  src={img.src}
  loading="lazy"
  decoding="async"
  className="w-full h-auto max-w-[1920px] md:max-w-[1920px] lg:max-w-[1920px]"
/>

              </div>
            ))}
        </div>

        <div className="w-full px-6">
          <div
            className={`max-w-7xl mx-auto items-center ${
              reverse ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div className="space-y-6 text-center flex flex-col items-center">
              <h2
                className="text-6xl md:text-8xl leading-[1.05] font-PlayfairDisplay"
                style={{ color: headingcolor }}
              >
                <OptimizedReveal>{title}</OptimizedReveal>
              </h2>

              <p
                className="text-md max-w-md mx-auto font-Poppins"
                style={{ color: paracolor }}
              >
                <OptimizedReveal>{subtitle}</OptimizedReveal>
              </p>

              <OptimizedReveal>
                <SpotlightLinkButton
                  href={link}
                  buttonColor={buttoncolor}
                  spotlightColor={hovercolor}
                  textHoverColor={texthover}
                  className="border-2"
                >
                  Explore →
                </SpotlightLinkButton>
              </OptimizedReveal>
            </div>

            {parallaxImages
              ?.filter(p => p.layer !== 'back')
              .map((img, i) => (
                <div
                  key={i}
                  ref={addParallaxRef}
                  data-speed={img.speed}
                  className={`parallax-layer absolute pointer-events-none z-30 ${img.className}`}
                >
                  <img
  src={img.src}
  loading="lazy"
  decoding="async"
  className="w-full h-auto max-w-[420px] md:max-w-[520px] lg:max-w-[620px]"
/>

                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
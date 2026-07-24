'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Store, UsersRound } from 'lucide-react'
import OptimizedReveal from '@/components/OptimizedReveal'
import SpotlightLinkButton from './SpotlightLinkButton'
import WebpImage from './WebpImage'

gsap.registerPlugin(ScrollTrigger)

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
  comingSoon?: boolean
  featureKind?: 'store' | 'social'
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
  comingSoon = false,
  featureKind = 'store',
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
    const isBackLayer = elements.map(el => el.dataset.layer === 'back')
    const sectionTop =
      containerRef.current.getBoundingClientRect().top + window.scrollY

    gsap.set(elements, {
      willChange: 'transform',
      force3D: true,
      transformPerspective: 1000,
    })

    const ySetters = elements.map(el => gsap.quickSetter(el, 'y', 'px'))
    const rSetters = elements.map(el => gsap.quickSetter(el, 'rotation', 'deg'))

    let active = false
    let lastScroll = -1
    let frameId = 0

    const update = () => {
      if (active) {
        const scroll = window.scrollY

        if (scroll !== lastScroll) {
          for (let i = 0; i < elements.length; i++) {
            const speed = speeds[i]
            const layerScroll = isBackLayer[i] ? scroll - sectionTop : scroll

            ySetters[i](-layerScroll * speed)
            rSetters[i](isBackLayer[i] ? 0 : scroll * speed * 0.12)
          }

          lastScroll = scroll
        }
      }

      frameId = requestAnimationFrame(update)
    }

    frameId = requestAnimationFrame(update)

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
      cancelAnimationFrame(frameId)
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
                data-layer="back"
                className={`parallax-layer absolute ${img.className}`}
              >
                <WebpImage
                  src={img.src}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full max-w-none object-cover"
                  alt=""
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
                {comingSoon ? (
                  <ComingSoonFeatureCard title={title} kind={featureKind} />
                ) : (
                  <SpotlightLinkButton
                    href={link}
                    buttonColor={buttoncolor}
                    spotlightColor={hovercolor}
                    textHoverColor={texthover}
                    className="border-2"
                  >
                    Explore -&gt;
                  </SpotlightLinkButton>
                )}
              </OptimizedReveal>
            </div>

            {parallaxImages
              ?.filter(p => p.layer !== 'back')
              .map((img, i) => (
                <div
                  key={i}
                  ref={addParallaxRef}
                  data-speed={img.speed}
                  data-layer="front"
                  className={`parallax-layer absolute pointer-events-none z-30 ${img.className}`}
                >
                  <WebpImage
                    src={img.src}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto max-w-[420px] md:max-w-[520px] lg:max-w-[620px]"
                    alt=""
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ComingSoonFeatureCard({
  title,
  kind,
}: {
  title: string
  kind: 'store' | 'social'
}) {
  const Icon = kind === 'store' ? Store : UsersRound

  return (
    <div
      aria-disabled="true"
      role="group"
      aria-label={`${title} is coming soon. Currently in development.`}
      className="group relative w-[min(92vw,27rem)] select-none overflow-hidden rounded-xl border border-white/20 bg-white/10 p-[1px] opacity-80 shadow-2xl shadow-black/20 blur-[0.15px] transition duration-500 ease-out hover:scale-[1.025] hover:opacity-90 hover:shadow-emerald-400/30"
      onClick={(event) => event.preventDefault()}
      onMouseDown={(event) => event.preventDefault()}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.34),transparent_32%),linear-gradient(120deg,rgba(4,108,78,0.18),rgba(11,28,45,0.28),rgba(252,244,225,0.16))] opacity-70 transition duration-500 group-hover:opacity-100" />
      <div className="absolute -inset-16 bg-[conic-gradient(from_90deg,transparent,rgba(16,185,129,0.28),transparent,rgba(252,244,225,0.18),transparent)] opacity-45 blur-2xl transition duration-700 group-hover:rotate-6 group-hover:opacity-75" />

      <div className="relative overflow-hidden rounded-xl">
        <div className="pointer-events-none absolute inset-0 z-10 bg-slate-950/62 backdrop-blur-md" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-white/10 via-transparent to-emerald-400/10" />

        <div className="relative z-30 flex min-h-64 flex-col items-center justify-center px-6 py-8 text-center sm:min-h-72">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-white/20 bg-white/12 text-emerald-200 shadow-lg shadow-black/20 transition duration-500 group-hover:border-emerald-200/60 group-hover:bg-emerald-400/20">
            <Icon size={28} aria-hidden="true" />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100/85">
            {title}
          </p>

          <div className="rounded-md border border-emerald-200/45 bg-emerald-300/18 px-5 py-2 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-emerald-950/25">
            Coming Soon
          </div>

          <p className="mt-4 text-sm font-medium text-white/82">
            Currently in development
          </p>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-[#FCF4E1]/70">
            Stay Tuned
          </p>
        </div>
      </div>
    </div>
  )
}

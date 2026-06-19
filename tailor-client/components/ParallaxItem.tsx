'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxItemProps {
  speed?: number // higher = faster
  className?: string
  children: React.ReactNode
}

export default function ParallaxItem({
  speed = 0.5,
  className = '',
  children,
}: ParallaxItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.to(ref.current, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, [speed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
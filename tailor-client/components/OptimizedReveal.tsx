'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function OptimizedReveal({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.set(el, { y: 24, opacity: 0 })

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
        })
      },
    })
  }, [])

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  )
}
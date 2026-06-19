'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

export default function SpotlightLinkButton({
  href,
  children,
  buttonColor = '#046C4E',      
  spotlightColor = '#FCF4E1',  
  textHoverColor = '#046C4E',    
  className = '',
}: {
  href: string
  children: React.ReactNode
  buttonColor?: string
  spotlightColor?: string
  textHoverColor?: string
  className?: string
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const spotRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const spot = spotRef.current
    if (!wrap || !spot) return

    const handleMouseMove = (e: MouseEvent) => {
  const rect = wrap.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  wrap.style.setProperty('--x', `${x}px`)
  wrap.style.setProperty('--y', `${y}px`)

  spot.animate(
    { left: `${x}px`, top: `${y}px` },
    { duration: 120, fill: 'forwards' }
  )
}

    const handleMouseLeave = () => {
  const cx = wrap.clientWidth / 2
  const cy = wrap.clientHeight / 2

  wrap.style.setProperty('--x', `${cx}px`)
  wrap.style.setProperty('--y', `${cy}px`)

  spot.animate(
    { left: `${cx}px`, top: `${cy}px` },
    { duration: 150, fill: 'forwards' }
  )
}


    wrap.addEventListener('mousemove', handleMouseMove)
    wrap.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      wrap.removeEventListener('mousemove', handleMouseMove)
      wrap.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <Link href={href} className="inline-block">
      <motion.div
        whileTap={{ scale: 0.985 }}
        ref={wrapRef}
        className={`
          relative overflow-hidden
          rounded-xl border-2
          px-6 py-2
          min-w-[170px]
          flex items-center justify-center
          cursor-pointer select-none
          ${className}
        `}
        style={{
          borderColor: buttonColor,
        }}
      >
        {/* ✅ BASE TEXT (always border color) */}
        <span
          className="relative z-10 font-medium"
          style={{ color: buttonColor }}
        >
          {children}
        </span>

        {/* ✅ SPOTLIGHT CIRCLE */}
        <span
          ref={spotRef}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 170,
            height: 90,
            background: spotlightColor,
            left: '50%',
            top: '50%',
          }}
        />

        {/* ✅ TEXT INSIDE SPOTLIGHT ONLY (masked) */}
        <span
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center font-medium"
          style={{
            color: textHoverColor,

            // 👇 this masks the second text ONLY inside the spotlight circle
            WebkitMaskImage:
              'radial-gradient(circle 85px at var(--x, 50%) var(--y, 50%), #000 98%, transparent 100%)',
            maskImage:
              'radial-gradient(circle 85px at var(--x, 50%) var(--y, 50%), #000 98%, transparent 100%)',
          }}
        >
          {children}
        </span>
      </motion.div>
    </Link>
  )
}

'use client'

import HeaderNavTabs from '@/components/HeaderNavTabs'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function MainHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    ScrollTrigger.create({
      start: 20,
      onUpdate: self => setScrolled(self.scroll() > 20),
    })
  }, [])

  const scrollToSectionmax = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return

    const yOffset = window.innerHeight * 0.9
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset

    window.scrollTo({ top: y, behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 w-full z-50 transition-all',
        scrolled && 'bg-[#FCF4E1]/80 backdrop-blur shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
        <img
          src="/images/Loomiz.png"
          className="w-[9rem] cursor-pointer"
          onClick={() => scrollToSectionmax('hero')}
        />

        <div className="hidden md:flex">
          <HeaderNavTabs onNavigate={scrollToSectionmax} />
        </div>

        <button
          onClick={() => scrollToSectionmax('tailor')}
          className="px-6 py-2 rounded-xl bg-[#046C4E] text-[#FCF4E1]"
        >
          Get Started
        </button>
      </div>
    </header>
  )
}
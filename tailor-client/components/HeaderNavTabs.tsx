'use client'

import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV_ITEMS = [
  { label: 'Tailor', id: 'tailor' },
  { label: 'Store', id: 'store' },
  { label: 'Social', id: 'social' },
]

export default function HeaderNavTabs({
  onNavigate,
}: {
  onNavigate: (id: string) => void
}) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    NAV_ITEMS.forEach(item => {
      ScrollTrigger.create({
        trigger: `#${item.id}`,
        start: 'top center',
        end: 'bottom center',
        onToggle: self => {
          if (self.isActive) setActiveId(item.id)
        },
      })
    })
  }, [])

  return (
    <ul className="flex gap-4">
      {NAV_ITEMS.map(item => (
        <li
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`cursor-pointer px-5 py-2 rounded-xl transition ${
            activeId === item.id
              ? 'bg-[#046C4E] text-white'
              : 'text-[#046C4E]'
          }`}
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}
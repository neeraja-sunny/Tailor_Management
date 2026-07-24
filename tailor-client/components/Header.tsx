'use client'

import { useAuth } from '@/app/context/AuthContext'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import clsx from 'clsx'

export default function Header() {
  const { user, logout, loading } = useAuth()
  const pathname = usePathname() || ''
  const [open, setOpen] = useState(false)

  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateHeader = () => setScrolled(window.scrollY > 24)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  const isLoggedIn = !!user
  const isAccountArea =
    pathname.startsWith('/tailor/dashboard') || pathname === '/tailor/profile'
  const isLandingPage = pathname === '/tailor'
  const isTransparent = isLandingPage && !scrolled

  if (!mounted) return null

  return (
    <header
      className={clsx(
        'no-print fixed left-0 top-0 z-[1000] w-full transition-all duration-300',
        isTransparent
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-black/10 bg-[#f5f5f7]/95 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl',
      )}
    >
      <div className="flex h-20 w-full items-center justify-between px-3 md:px-8 lg:px-10">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-10">
          <Link href={isLoggedIn ? "/tailor/dashboard" : "/tailor"} className="flex items-center gap-1 ml-0">
            <img
              src="/dressmaker.png"
              alt="TailorPro Logo"
              className={clsx(
                'h-11 w-11 object-contain transition-[filter] duration-300',
                isTransparent && 'brightness-0 invert',
              )}
            />
            <span
              className={clsx(
                'text-2xl font-bold transition-colors duration-300',
                isTransparent ? 'text-white' : 'text-black',
              )}
            >
              Tailor
              <span className={isTransparent ? 'text-white' : 'text-emerald-500'}>
                Pro
              </span>
            </span>
          </Link>

          {/* Navigation links — ONLY when logged OUT */}
          {!loading && !isAccountArea && (
            <nav
              className={clsx(
                'hidden gap-8 text-lg transition-colors duration-300 md:flex',
                isTransparent ? 'text-white' : 'text-black',
              )}
            >
              {['Customers', 'Blogs', 'Pricing'].map((link) => (
                <Link
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="relative group left-5"
                >
                  {link}
                  <span
                    className={clsx(
                      'absolute -bottom-1 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full',
                      isTransparent ? 'bg-white' : 'bg-black',
                    )}
                  />
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center justify-end w-full max-w-xs">
          {loading ? (
            <div className="h-12 w-32" aria-hidden="true" />
          ) : !isLoggedIn ? (
            <Link
              href="/auth"
              className="
                flex text-lg items-center gap-3 
                px-6 py-3 
                bg-emerald-700 
                rounded-full 
                text-white 
                font-medium 
                transition-all duration-200 ease-out
                hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl shadow-emerald-700
              "
            >
              Login
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-black">
                <ChevronRight size={16} className="text-white" />
              </span>
            </Link>
          ) : (
            <div className="relative z-[1001]">
              <button
                onClick={() => setOpen(!open)}
                className="  flex text-lg items-center gap-3 
                px-6 py-3 
                bg-emerald-700 
                rounded-full 
                text-white 
                font-medium 
                transition-all duration-200 ease-out
                hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl shadow-emerald-700"
              >
                {user.fullName || user.email}
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-200 ${
                    open ? 'rotate-90' : ''
                  }`}
                />
              </button>

              <div
                className={`absolute right-0 mt-2 w-40 z-[1002] bg-white rounded-md text-black shadow ${
                  open ? 'block' : 'hidden'
                }`}
              >
                <Link
                  href="/tailor/dashboard"
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 hover:bg-gray-100 text-md font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/tailor/profile"
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 hover:bg-gray-100 text-md font-medium"
                >
                  Profile
                </Link>

                <button
                  onClick={async () => {
                    await logout()
                    window.location.href = '/auth'
                  }}
                  className="block w-full text-left px-6 py-4 hover:bg-gray-100 text-md font-medium text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

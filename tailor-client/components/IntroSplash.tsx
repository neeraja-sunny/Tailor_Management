'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function IntroSplash({
  show,
  logoSrc = "/images/Loomiz white.png",
  brandGreen = '#046C4E',
}: {
  show: boolean
  logoSrc?: string
  brandGreen?: string
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: brandGreen }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          {/* Logo animation */}
          <motion.img
            src={logoSrc}
  alt="Brand Logo"
  className="w-24 md:w-32 lg:w-36 drop-shadow-[0_0_25px_rgba(255,255,255,0.45)]"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

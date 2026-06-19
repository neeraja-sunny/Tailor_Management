'use client'

import { motion, MotionValue, useTransform } from 'framer-motion'

interface Props {
    text: string
    scrollYProgress: MotionValue<number>
    start?: number
    end?: number
    className?: string
}


const isMobile = typeof window !== 'undefined' && window.innerWidth < 768



export default function ScrollRevealText({
    text,
    scrollYProgress,
    start = 0.15,
    end = 0.35,
    className = '',
}: Props) {
    const letters = text.split('')
    const total = letters.length

    return (
        <span className={`inline-block ${className}`}>
            {letters.map((char, i) => {
                const letterStart = start + (i / total) * (end - start)
                const letterEnd = letterStart + (end - start) / total * 1.2

                const opacity = useTransform(scrollYProgress, [letterStart, letterEnd], [0, 1])
                const y = useTransform(scrollYProgress, [letterStart, letterEnd], [12, 0])
                const blur = isMobile
                    ? 'blur(0px)'
                    : useTransform(scrollYProgress, [letterStart, letterEnd], ['blur(10px)', 'blur(0px)'])


                return (
                    <motion.span
                        key={i}
                        style={{
                            opacity,
                            y,
                            filter: blur,
                        }}
                        className="inline-block will-change-transform"
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                )
            })}
        </span>
    )
}

"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variant } from 'framer-motion'

interface AnimatedTextProps {
  staticStart: string
  animatedWords: string[]
  staticEnd: string
  interval?: number
  animation?: 'fade' | 'slide' | 'bounce' | 'rotate' | 'scale'
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },
  bounce: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 15 } },
    exit: { y: 20, opacity: 0 },
  },
  rotate: {
    initial: { rotateX: 90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: -90, opacity: 0 },
  },
  scale: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.5, opacity: 0 },
  },
}

export default function AnimatedText({
  staticStart = "Transcribe your",
  animatedWords = ["JPG", "PDF", "DOC"],
  staticEnd = "into Text easy with AI",
  interval = 1500,
  animation = 'slide'
}: AnimatedTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (animatedWords.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % animatedWords.length)
    }, interval)

    return () => clearInterval(timer)
  }, [animatedWords, interval])

  const maxWidth = Math.max(...animatedWords.map(word => word.length)) + 'ch'

  return (
      <h1 className="text-5xl font-extrabold text-indigo-600 mb-4">
        <span>{staticStart}</span>
        <div 
          style={{ width: maxWidth }} 
          className="inline-flex justify-center items-center"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={animations[animation].initial}
              animate={animations[animation].animate}
              exit={animations[animation].exit}
              transition={{ duration: 0.3 }}
              className="inline-block text-orange-500"
            >
              {animatedWords[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
        <span>{staticEnd}</span>
      </h1>
  )
}
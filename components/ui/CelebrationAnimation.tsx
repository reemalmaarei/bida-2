'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

const confettiColors = ['#B0C4E8', '#F4C430', '#B8D97E', '#F5A65B', '#E8B4C5']

export default function CelebrationAnimation() {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Animation will last 3 seconds
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-2">Great Job!</h1>
          <p className="text-gray-600">Assessment completed</p>
          <p className="text-sm text-gray-500 mt-4">Generating personalized activities...</p>
        </motion.div>

        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: confettiColors[i % confettiColors.length],
              left: '50%',
              top: '50%',
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: (Math.random() - 0.5) * 300,
              y: (Math.random() - 0.5) * 300,
              opacity: 0,
            }}
            transition={{
              duration: 2,
              delay: i * 0.05,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}
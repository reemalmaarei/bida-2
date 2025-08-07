'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const onboardingSlides = [
  {
    title: 'Welcome to Bida',
    description: 'Your partner in supporting your child\'s developmental journey',
    icon: '👶',
    color: 'bg-periwinkle',
    details: null
  },
  {
    title: 'Track Milestones',
    description: 'Monitor your child\'s progress across five key developmental domains',
    icon: '📊',
    color: 'bg-yellow',
    details: null
  },
  {
    title: 'Five Developmental Areas',
    description: 'We help you track growth in all areas of development',
    icon: '🌟',
    color: 'bg-periwinkle',
    details: [
      { name: 'Communication', desc: 'Language, understanding & expression', color: 'bg-yellow' },
      { name: 'Gross Motor', desc: 'Movement, balance & coordination', color: 'bg-green' },
      { name: 'Fine Motor', desc: 'Hand skills & manipulation', color: 'bg-orange' },
      { name: 'Problem-Solving', desc: 'Thinking & learning skills', color: 'bg-periwinkle' },
      { name: 'Personal-Social', desc: 'Relationships & self-care', color: 'bg-pink' }
    ]
  },
  {
    title: 'Personalized Activities',
    description: 'Get 30-40 activities tailored to your child\'s current developmental stage',
    icon: '🎯',
    color: 'bg-green',
    details: null
  },
  {
    title: 'Expert Guidance',
    description: 'Access resources and connect with child development specialists',
    icon: '👩‍⚕️',
    color: 'bg-pink',
    details: null
  }
]

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      router.push('/login')
    }
  }

  const handleSkip = () => {
    router.push('/login')
  }

  const slide = onboardingSlides[currentSlide]

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {slide.details ? (
              <>
                <h1 className="text-3xl font-bold mb-2">{slide.title}</h1>
                <p className="text-gray-600 mb-6">{slide.description}</p>
                <div className="space-y-3 text-left max-w-sm mx-auto">
                  {slide.details.map((detail, index) => (
                    <motion.div
                      key={detail.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className={`w-10 h-10 ${detail.color} rounded-full flex-shrink-0`} />
                      <div>
                        <p className="font-semibold text-sm">{detail.name}</p>
                        <p className="text-xs text-gray-500">{detail.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className={`w-32 h-32 ${slide.color} rounded-full flex items-center justify-center mx-auto mb-8`}>
                  <span className="text-6xl">{slide.icon}</span>
                </div>
                <h1 className="text-3xl font-bold mb-4">{slide.title}</h1>
                <p className="text-gray-600 text-lg">{slide.description}</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8">
        <div className="flex justify-center mb-8">
          {onboardingSlides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 transition-all ${
                index === currentSlide ? 'w-8 bg-gray-800' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleSkip}
            className="touch-button text-gray-500"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="touch-button bg-periwinkle text-white px-8"
          >
            {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
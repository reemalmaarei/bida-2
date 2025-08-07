'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Baby, Target, Heart, Sparkles, ArrowRight } from 'lucide-react'

export default function WelcomePage() {
  const router = useRouter()

  const features = [
    {
      icon: Baby,
      title: 'Track Development',
      description: 'Monitor your child\'s growth across key developmental areas'
    },
    {
      icon: Target,
      title: 'Personalized Activities',
      description: 'Get activities tailored to your child\'s needs and age'
    },
    {
      icon: Heart,
      title: 'Expert Guidance',
      description: 'Access evidence-based resources and expert advice'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-periwinkle/10 to-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-periwinkle rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Sparkles className="text-white" size={48} />
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Bida
            </h1>
            <p className="text-lg text-gray-600 max-w-sm mx-auto">
              Your companion in supporting your child's developmental journey
            </p>
          </motion.div>

          <div className="space-y-4 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-periwinkle/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <feature.icon className="text-periwinkle" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-sm text-gray-500 mb-2">
              Let's get started by adding your child's profile
            </p>
            <p className="text-xs text-gray-400">
              It only takes a minute
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bottom-action-area"
      >
        <button
          onClick={() => router.push('/add-child')}
          className="w-full touch-button bg-periwinkle text-white flex items-center justify-center group"
        >
          <span className="mr-2">Get Started</span>
          <ArrowRight 
            size={20} 
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </motion.div>
    </div>
  )
}
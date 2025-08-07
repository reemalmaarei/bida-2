'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle } from 'lucide-react'
import { Milestone, MilestoneResponse, TryItGuide as TryItGuideType } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

// Default instructions for common milestones
const getDefaultInstructions = (milestone: Milestone): string => {
  const title = milestone.title.toLowerCase()
  
  if (title.includes('smile')) {
    return "Sit face-to-face with your baby. Smile and talk to them warmly. Watch if they smile back at you."
  }
  if (title.includes('head')) {
    return "Place your baby on their tummy on a safe surface. Watch if they can lift and hold their head up."
  }
  if (title.includes('reach')) {
    return "Hold a toy within your baby's reach. See if they try to grab it with their hands."
  }
  if (title.includes('roll')) {
    return "Place your baby on their tummy. Watch if they can roll over to their back on their own."
  }
  if (title.includes('sit')) {
    return "Help your baby into a sitting position, then let go. See if they can sit without support for a few seconds."
  }
  if (title.includes('coo')) {
    return "Talk to your baby and wait for a response. Listen for cooing, gurgling, or babbling sounds."
  }
  if (title.includes('laugh')) {
    return "Play peek-a-boo or make funny faces. See if your baby laughs out loud."
  }
  
  return "Observe your child during play or daily activities. Look for the behavior described in the milestone."
}

interface TryItGuideProps {
  milestone: Milestone
  onClose: () => void
  onComplete: (response: MilestoneResponse) => void
}

export default function TryItGuide({ milestone, onClose, onComplete }: TryItGuideProps) {
  const [guide, setGuide] = useState<TryItGuideType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGuide()
  }, [milestone])

  const loadGuide = async () => {
    const supabase = createClient()
    
    if (!supabase) {
      // No Supabase configured, no guide available
      setIsLoading(false)
      return
    }
    
    const { data } = await supabase
      .from('try_it_guides')
      .select('*')
      .eq('milestone_id', milestone.id)
      .single()

    if (data) {
      setGuide(data)
    }
    setIsLoading(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white rounded-t-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Try It Guide</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-periwinkle"></div>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">How to check:</h3>
                <div className="bg-periwinkle/10 rounded-xl p-4 mb-4">
                  <p className="text-base leading-relaxed">
                    {guide?.instructions || getDefaultInstructions(milestone)}
                  </p>
                </div>
                <div className="bg-yellow/10 rounded-xl p-4">
                  <p className="text-sm font-medium mb-1">💡 Tip:</p>
                  <p className="text-sm">
                    {guide?.tips || "Make it fun! Use toys, songs, or games to engage your child."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100">
            <p className="text-center text-base font-medium text-gray-700 mb-4">
              After trying, can your child do this?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => onComplete('yes')}
                className="w-full py-4 px-6 bg-green/20 border-2 border-green rounded-xl flex items-center justify-center hover:bg-green/30 transition-colors"
              >
                <CheckCircle size={24} className="mr-2 text-green" />
                <span className="text-lg font-semibold text-green-800">Yes, they can!</span>
              </button>
              <button
                onClick={() => onComplete('not_yet')}
                className="w-full py-4 px-6 bg-gray-100 border-2 border-gray-300 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <XCircle size={24} className="mr-2 text-gray-500" />
                <span className="text-lg font-semibold text-gray-700">Not yet</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
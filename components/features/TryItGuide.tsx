'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle } from 'lucide-react'
import { Milestone, MilestoneResponse, TryItGuide as TryItGuideType } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

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
            ) : guide ? (
              <>
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">{guide.title}</h3>
                  <div className="bg-periwinkle/10 rounded-xl p-4 mb-4">
                    <p className="whitespace-pre-line">{guide.instructions}</p>
                  </div>
                  {guide.tips && (
                    <div className="bg-yellow/10 rounded-xl p-4">
                      <p className="text-sm font-medium mb-1">💡 Tips:</p>
                      <p className="text-sm">{guide.tips}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No guide available for this milestone</p>
                <p className="text-sm text-gray-400">Try observing your child during regular activities</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600 mb-4">
              After trying, can your child do this?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => onComplete('not_yet')}
                className="flex-1 touch-button bg-gray-100 text-gray-700"
              >
                <XCircle size={20} className="mr-2" />
                Not yet
              </button>
              <button
                onClick={() => onComplete('yes')}
                className="flex-1 touch-button bg-green/20 text-green-800"
              >
                <CheckCircle size={20} className="mr-2" />
                Yes!
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
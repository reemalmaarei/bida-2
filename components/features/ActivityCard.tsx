'use client'

import { Activity } from '@/lib/types'
import { DOMAIN_COLORS, DOMAIN_LABELS } from '@/lib/types'
import { Check, Bookmark, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'

interface ActivityCardProps {
  activity: Activity
  onStateChange: (id: string, state: 'active' | 'completed' | 'saved') => void
}

export default function ActivityCard({ activity, onStateChange }: ActivityCardProps) {
  const domainColor = DOMAIN_COLORS[activity.domain]
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-${domainColor}/20 text-gray-700 mb-2`}>
            {DOMAIN_LABELS[activity.domain]}
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
          <p className="text-sm text-gray-600">{activity.description}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-3">
        {activity.state === 'active' && (
          <>
            <button
              onClick={() => onStateChange(activity.id, 'saved')}
              className="touch-button bg-gray-100 text-gray-600 px-3 py-2 text-sm"
            >
              <Bookmark size={18} />
            </button>
            <button
              onClick={() => onStateChange(activity.id, 'completed')}
              className="touch-button bg-green/20 text-green-800 px-3 py-2 text-sm"
            >
              <Check size={18} />
            </button>
          </>
        )}
        
        {activity.state === 'completed' && (
          <button
            onClick={() => onStateChange(activity.id, 'active')}
            className="touch-button bg-gray-100 text-gray-600 px-3 py-2 text-sm"
          >
            <RotateCcw size={18} />
          </button>
        )}
        
        {activity.state === 'saved' && (
          <>
            <button
              onClick={() => onStateChange(activity.id, 'active')}
              className="touch-button bg-gray-100 text-gray-600 px-3 py-2 text-sm"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={() => onStateChange(activity.id, 'completed')}
              className="touch-button bg-green/20 text-green-800 px-3 py-2 text-sm"
            >
              <Check size={18} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
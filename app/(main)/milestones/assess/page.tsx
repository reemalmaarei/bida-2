'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Milestone, MilestoneResponse, DevelopmentalDomain } from '@/lib/types'
import { DOMAINS, DOMAIN_LABELS, DOMAIN_COLORS } from '@/lib/types'
import { getDemoMilestones } from '@/lib/demo-milestones'
import TryItGuide from '@/components/features/TryItGuide'
import CelebrationAnimation from '@/components/ui/CelebrationAnimation'
import { motion, AnimatePresence } from 'framer-motion'

function AssessmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get('child')
  const assessmentMonth = parseInt(searchParams.get('month') || '0')
  const isFirstAssessment = searchParams.get('first') === 'true'

  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0)
  const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, MilestoneResponse>>({})
  const [showTryItGuide, setShowTryItGuide] = useState(false)
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    if (childId && assessmentMonth) {
      loadMilestones()
    }
  }, [childId, assessmentMonth])

  const loadMilestones = async () => {
    const supabase = createClient()
    
    if (!supabase) {
      // No Supabase configured, use demo milestones
      const demoMilestones = getDemoMilestones(assessmentMonth)
      setMilestones(demoMilestones)
      if (demoMilestones.length > 0) {
        setCurrentMilestone(demoMilestones[0])
      }
      setIsLoading(false)
      return
    }
    
    const { data } = await supabase
      .from('milestones')
      .select('*')
      .eq('assessment_month', assessmentMonth)
      .order('order_index', { ascending: true })

    if (data) {
      setMilestones(data)
      setCurrentMilestone(data[0])
    }
    setIsLoading(false)
  }

  const currentDomain = DOMAINS[currentDomainIndex]
  const domainMilestones = milestones.filter(m => m.domain === currentDomain)
  const currentMilestoneData = domainMilestones[currentMilestoneIndex]
  
  const totalMilestones = DOMAINS.length * 2
  const completedMilestones = Object.keys(responses).length
  const progress = (completedMilestones / totalMilestones) * 100

  const handleResponse = async (response: MilestoneResponse) => {
    if (!currentMilestoneData) return

    if (response === 'try_it') {
      setShowTryItGuide(true)
      return
    }

    const newResponses = {
      ...responses,
      [currentMilestoneData.id]: response
    }
    setResponses(newResponses)

    if (currentMilestoneIndex < 1) {
      setCurrentMilestoneIndex(1)
      setCurrentMilestone(domainMilestones[1])
    } else {
      if (currentDomainIndex < DOMAINS.length - 1) {
        setCurrentDomainIndex(currentDomainIndex + 1)
        setCurrentMilestoneIndex(0)
        const nextDomainMilestones = milestones.filter(m => m.domain === DOMAINS[currentDomainIndex + 1])
        setCurrentMilestone(nextDomainMilestones[0])
      } else {
        await saveAssessment(newResponses)
      }
    }
  }

  const saveAssessment = async (allResponses: Record<string, MilestoneResponse>) => {
    setShowCelebration(true)
    
    const supabase = createClient()
    
    const assessmentData = Object.entries(allResponses).map(([milestoneId, response]) => ({
      child_id: childId,
      milestone_id: milestoneId,
      assessment_month: assessmentMonth,
      response: response
    }))

    if (supabase) {
      await supabase
        .from('milestone_assessments')
        .insert(assessmentData)
    }

    await generateActivities(allResponses)

    setTimeout(() => {
      if (isFirstAssessment) {
        // Store that onboarding is complete
        localStorage.setItem('onboardingComplete', 'true')
      }
      router.push('/activities')
    }, 3000)
  }

  const generateActivities = async (responses: Record<string, MilestoneResponse>) => {
    const supabase = createClient()
    
    const activities = []
    const notYetMilestones = Object.entries(responses)
      .filter(([_, response]) => response === 'not_yet')
      .map(([milestoneId]) => milestones.find(m => m.id === milestoneId))
      .filter(Boolean)

    for (const milestone of notYetMilestones) {
      if (!milestone) continue
      
      for (let i = 0; i < 8; i++) {
        activities.push({
          child_id: childId,
          title: `Practice: ${milestone.title}`,
          description: milestone.description || '',
          domain: milestone.domain,
          state: 'active'
        })
      }
    }

    if (activities.length < 30) {
      const additionalCount = 30 - activities.length
      for (let i = 0; i < additionalCount; i++) {
        const randomDomain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)]
        activities.push({
          child_id: childId,
          title: `General ${DOMAIN_LABELS[randomDomain]} Activity ${i + 1}`,
          description: `Age-appropriate activity for ${assessmentMonth} months`,
          domain: randomDomain,
          state: 'active'
        })
      }
    }

    if (supabase) {
      await supabase.from('activities').insert(activities)
    } else {
      // Save to localStorage in demo mode
      localStorage.setItem('demoActivities', JSON.stringify(activities))
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-periwinkle"></div>
      </div>
    )
  }

  if (showCelebration) {
    return <CelebrationAnimation />
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white border-b border-gray-200 p-4">
        {isFirstAssessment && currentMilestoneIndex === 0 && (
          <div className="bg-periwinkle/10 rounded-xl p-3 mb-4">
            <p className="text-sm text-periwinkle font-medium">
              Welcome! Let's do a quick check to see where your child is at.
            </p>
            <p className="text-xs text-gray-600 mt-1">
              This helps us create personalized activities just for them.
            </p>
          </div>
        )}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">{assessmentMonth} Month Assessment</h2>
            <span className="text-sm text-gray-600">
              {completedMilestones}/{totalMilestones}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-periwinkle h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex space-x-2">
          {DOMAINS.map((domain, index) => {
            const domainColor = DOMAIN_COLORS[domain]
            const isCompleted = index < currentDomainIndex
            const isCurrent = index === currentDomainIndex
            
            return (
              <div
                key={domain}
                className={`flex-1 py-2 px-3 rounded-lg text-center text-xs ${
                  isCompleted ? `bg-${domainColor}/30` :
                  isCurrent ? `bg-${domainColor}/20 border-2 border-${domainColor}` :
                  'bg-gray-100'
                }`}
              >
                {DOMAIN_LABELS[domain]}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6">
        <AnimatePresence mode="wait">
          {currentMilestoneData && (
            <motion.div
              key={currentMilestoneData.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              {/* Question Section */}
              <div className="flex-1 flex flex-col justify-center text-center px-4">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-3">{currentMilestoneData.title}</h3>
                  {currentMilestoneData.description && (
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {currentMilestoneData.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Response Buttons - Large and Clickable */}
              <div className="space-y-3 pb-safe">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleResponse('yes')}
                  className="w-full py-5 px-6 bg-green/20 border-2 border-green rounded-2xl flex items-center justify-between group hover:bg-green/30 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">✓</span>
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-semibold text-gray-900 block">Yes!</span>
                      <span className="text-sm text-gray-600">My child can do this</span>
                    </div>
                  </div>
                  <div className="text-green">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleResponse('try_it')}
                  className="w-full py-5 px-6 bg-orange/20 border-2 border-orange rounded-2xl flex items-center justify-between group hover:bg-orange/30 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange/20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">🤔</span>
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-semibold text-gray-900 block">Let me try</span>
                      <span className="text-sm text-gray-600">Show me how to check</span>
                    </div>
                  </div>
                  <div className="text-orange">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleResponse('not_yet')}
                  className="w-full py-5 px-6 bg-gray-100 border-2 border-gray-300 rounded-2xl flex items-center justify-between group hover:bg-gray-200 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl">✗</span>
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-semibold text-gray-900 block">Not yet</span>
                      <span className="text-sm text-gray-600">We'll work on this</span>
                    </div>
                  </div>
                  <div className="text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showTryItGuide && currentMilestoneData && (
        <TryItGuide
          milestone={currentMilestoneData}
          onClose={() => setShowTryItGuide(false)}
          onComplete={(response) => {
            setShowTryItGuide(false)
            handleResponse(response)
          }}
        />
      )}
    </div>
  )
}

export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-periwinkle"></div>
      </div>
    }>
      <AssessmentContent />
    </Suspense>
  )
}
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

      <div className="flex-1 flex flex-col justify-center p-8">
        <AnimatePresence mode="wait">
          {currentMilestoneData && (
            <motion.div
              key={currentMilestoneData.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold mb-4">{currentMilestoneData.title}</h3>
              {currentMilestoneData.description && (
                <p className="text-gray-600 mb-8">{currentMilestoneData.description}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bottom-action-area">
        <div className="flex space-x-3">
          <button
            onClick={() => handleResponse('not_yet')}
            className="flex-1 touch-button bg-gray-100 text-gray-700"
          >
            Not yet
          </button>
          <button
            onClick={() => handleResponse('try_it')}
            className="flex-1 touch-button bg-orange/20 text-orange-800"
          >
            Try it
          </button>
          <button
            onClick={() => handleResponse('yes')}
            className="flex-1 touch-button bg-green/20 text-green-800"
          >
            Yes!
          </button>
        </div>
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
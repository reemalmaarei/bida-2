'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Child } from '@/lib/types'
import { ASSESSMENT_MONTHS } from '@/lib/types'
import { differenceInMonths } from 'date-fns'
import { ChevronRight, CheckCircle, Circle } from 'lucide-react'

export default function MilestonesPage() {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [completedAssessments, setCompletedAssessments] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedChild) {
      loadCompletedAssessments(selectedChild.id)
    }
  }, [selectedChild])

  const loadData = async () => {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: childrenData } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: true })

    if (childrenData && childrenData.length > 0) {
      setChildren(childrenData)
      setSelectedChild(childrenData[0])
    }
    setIsLoading(false)
  }

  const loadCompletedAssessments = async (childId: string) => {
    const supabase = createClient()
    
    const { data } = await supabase
      .from('milestone_assessments')
      .select('assessment_month')
      .eq('child_id', childId)

    if (data) {
      const monthsSet = new Set(data.map(a => a.assessment_month))
      const months = Array.from(monthsSet)
      setCompletedAssessments(months)
    }
  }

  const getChildAgeInMonths = (birthDate: string) => {
    return differenceInMonths(new Date(), new Date(birthDate))
  }

  const getAssessmentStatus = (month: number) => {
    if (!selectedChild) return 'upcoming'
    
    const ageInMonths = getChildAgeInMonths(selectedChild.birth_date)
    
    if (completedAssessments.includes(month)) return 'completed'
    if (month <= ageInMonths) return 'due'
    return 'upcoming'
  }

  const startAssessment = (month: number) => {
    if (selectedChild) {
      router.push(`/milestones/assess?child=${selectedChild.id}&month=${month}`)
    }
  }

  if (!selectedChild) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No child profile found</p>
          <a href="/add-child" className="text-periwinkle">Add your first child</a>
        </div>
      </div>
    )
  }

  const childAgeInMonths = getChildAgeInMonths(selectedChild.birth_date)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">Milestones</h1>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-1">{selectedChild.avatar_url}</span>
            <span>{selectedChild.name}</span>
            <span className="mx-2">•</span>
            <span>{childAgeInMonths} months old</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-periwinkle"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {ASSESSMENT_MONTHS.map((month) => {
              const status = getAssessmentStatus(month)
              
              return (
                <button
                  key={month}
                  onClick={() => status === 'due' && startAssessment(month)}
                  disabled={status !== 'due'}
                  className={`w-full bg-white rounded-xl p-4 shadow-sm border transition-all ${
                    status === 'due' 
                      ? 'border-periwinkle hover:shadow-md cursor-pointer' 
                      : status === 'completed'
                      ? 'border-green bg-green/5 cursor-default'
                      : 'border-gray-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {status === 'completed' ? (
                        <CheckCircle className="text-green mr-3" size={24} />
                      ) : (
                        <Circle className={`mr-3 ${status === 'due' ? 'text-periwinkle' : 'text-gray-300'}`} size={24} />
                      )}
                      <div className="text-left">
                        <p className="font-semibold">{month} Month Assessment</p>
                        <p className="text-sm text-gray-600">
                          {status === 'completed' ? 'Completed' : 
                           status === 'due' ? 'Ready to start' : 
                           `Available at ${month} months`}
                        </p>
                      </div>
                    </div>
                    {status === 'due' && <ChevronRight className="text-gray-400" size={20} />}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
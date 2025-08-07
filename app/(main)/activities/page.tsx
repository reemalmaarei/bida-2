'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Activity, Child } from '@/lib/types'
import ActivityCard from '@/components/features/ActivityCard'
import { ChevronDown } from 'lucide-react'

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [filter, setFilter] = useState<'active' | 'completed' | 'saved'>('active')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedChild) {
      loadActivities(selectedChild.id)
    }
  }, [selectedChild, filter])

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
  }

  const loadActivities = async (childId: string) => {
    setIsLoading(true)
    const supabase = createClient()
    
    const { data } = await supabase
      .from('activities')
      .select('*')
      .eq('child_id', childId)
      .eq('state', filter)
      .order('created_at', { ascending: false })
      .limit(20)

    if (data) {
      setActivities(data)
    }
    setIsLoading(false)
  }

  const handleActivityStateChange = async (activityId: string, newState: 'active' | 'completed' | 'saved') => {
    const supabase = createClient()
    
    const updateData: any = { state: newState }
    if (newState === 'completed') {
      updateData.completed_at = new Date().toISOString()
    } else if (newState === 'saved') {
      updateData.saved_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('activities')
      .update(updateData)
      .eq('id', activityId)

    if (!error && selectedChild) {
      loadActivities(selectedChild.id)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Activities</h1>
              <button className="flex items-center text-sm text-gray-600 mt-1">
                <span className="mr-1">{selectedChild.avatar_url}</span>
                <span>{selectedChild.name}</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            {(['active', 'completed', 'saved'] as const).map((state) => (
              <button
                key={state}
                onClick={() => setFilter(state)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === state
                    ? 'bg-periwinkle text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {state.charAt(0).toUpperCase() + state.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-periwinkle"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No {filter} activities</p>
            {filter === 'active' && (
              <a href="/milestones" className="text-periwinkle">
                Complete a milestone check to get activities
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onStateChange={handleActivityStateChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
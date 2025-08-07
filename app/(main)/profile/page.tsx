'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Child, Parent } from '@/lib/types'
import { Plus, Edit2, LogOut, FileText, ChevronRight } from 'lucide-react'
import { differenceInMonths } from 'date-fns'

export default function ProfilePage() {
  const router = useRouter()
  const [parent, setParent] = useState<Parent | null>(null)
  const [children, setChildren] = useState<Child[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setIsLoading(true)
    
    // Check for demo mode first
    const isDemoUser = localStorage.getItem('demoUser') === 'true'
    if (isDemoUser) {
      // Load demo data from localStorage
      const demoChildren = JSON.parse(localStorage.getItem('demoChildren') || '[]')
      setChildren(demoChildren)
      setParent({
        id: 'demo-user-123',
        phone: 'Demo User',
        created_at: new Date().toISOString(),
        onboarded: true
      } as Parent)
      setIsLoading(false)
      return
    }
    
    const supabase = createClient()
    
    if (!supabase) {
      // No Supabase, use demo mode
      const demoChildren = JSON.parse(localStorage.getItem('demoChildren') || '[]')
      setChildren(demoChildren)
      setParent({
        id: 'demo-user-123',
        phone: 'Demo User',
        created_at: new Date().toISOString(),
        onboarded: true
      } as Parent)
      setIsLoading(false)
      return
    }
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // No user, redirect to add-child page
      router.push('/add-child')
      return
    }

    const { data: parentData } = await supabase
      .from('parents')
      .select('*')
      .eq('id', user.id)
      .single()

    if (parentData) {
      setParent(parentData)
    }

    const { data: childrenData } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: true })

    if (childrenData) {
      setChildren(childrenData)
    }
    setIsLoading(false)
  }

  const handleSignOut = async () => {
    // Clear demo data
    localStorage.removeItem('demoUser')
    localStorage.removeItem('userId')
    localStorage.removeItem('demoChildren')
    localStorage.removeItem('currentChild')
    localStorage.removeItem('demoActivities')
    
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    
    router.push('/add-child')
  }

  const getChildAge = (birthDate: string) => {
    const months = differenceInMonths(new Date(), new Date(birthDate))
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`
    }
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    return `${years} year${years !== 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} mo` : ''}`
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-periwinkle"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {parent && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-gray-900">Account</h2>
              <Edit2 size={18} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">{parent.phone}</p>
            <p className="text-xs text-gray-400 mt-1">
              Member since {new Date(parent.created_at).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Children</h2>
              {children.length < 5 && (
                <button
                  onClick={() => router.push('/add-child')}
                  className="text-periwinkle"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
          </div>

          {children.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500 mb-2">No children added</p>
              <button
                onClick={() => router.push('/add-child')}
                className="text-periwinkle text-sm"
              >
                Add your first child
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {children.map((child) => (
                <button
                  key={child.id}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{child.avatar_url}</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{child.name}</p>
                      <p className="text-sm text-gray-600">
                        {getChildAge(child.birth_date)} old
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <button className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <FileText size={20} className="text-gray-600 mr-3" />
              <span className="font-medium text-gray-900">Generate PDF Report</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-gray-600 mr-3">ℹ️</span>
              <span className="font-medium text-gray-900">About Bida</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <button className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-gray-600 mr-3">📄</span>
              <span className="font-medium text-gray-900">Terms & Privacy</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full bg-white rounded-xl p-4 shadow-sm border border-red-200 flex items-center justify-center"
        >
          <LogOut size={20} className="text-red-600 mr-2" />
          <span className="font-medium text-red-600">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
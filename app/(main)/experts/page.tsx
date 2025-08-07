'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Expert } from '@/lib/types'
import { Users, Mail, Clock } from 'lucide-react'

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadExperts()
  }, [])

  const loadExperts = async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    const { data } = await supabase
      .from('experts')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setExperts(data)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Experts</h1>
          <p className="text-gray-600 text-sm mt-1">Connect with child development specialists</p>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-periwinkle"></div>
          </div>
        ) : experts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No experts available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {experts.map((expert) => (
              <div
                key={expert.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-periwinkle/20 rounded-full flex items-center justify-center mr-3">
                    <Users size={24} className="text-periwinkle" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{expert.name}</h3>
                    {expert.title && (
                      <p className="text-sm text-gray-600">{expert.title}</p>
                    )}
                    {expert.specialty && (
                      <p className="text-xs text-periwinkle font-medium mt-1">{expert.specialty}</p>
                    )}
                    {expert.bio && (
                      <p className="text-sm text-gray-600 mt-2">{expert.bio}</p>
                    )}
                    
                    {expert.contact_info && (
                      <div className="mt-3 space-y-1">
                        {(expert.contact_info as any).email && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Mail size={14} className="mr-1" />
                            {(expert.contact_info as any).email}
                          </div>
                        )}
                        {(expert.contact_info as any).availability && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock size={14} className="mr-1" />
                            {(expert.contact_info as any).availability}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button className="w-full touch-button bg-periwinkle/10 text-periwinkle mt-4">
                  Contact Expert
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
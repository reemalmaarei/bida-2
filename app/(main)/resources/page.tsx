'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Resource } from '@/lib/types'
import { BookOpen, ChevronRight } from 'lucide-react'

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadResources()
  }, [selectedCategory])

  const loadResources = async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    let query = supabase.from('resources').select('*')
    
    if (selectedCategory) {
      query = query.eq('category', selectedCategory)
    }

    const { data } = await query.order('created_at', { ascending: false })

    if (data) {
      setResources(data)
    }
    setIsLoading(false)
  }

  const categories = ['development', 'sleep', 'nutrition', 'behavior', 'health']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Resources</h1>
          
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !selectedCategory
                  ? 'bg-periwinkle text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-periwinkle text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
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
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No resources available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                    {resource.description && (
                      <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                    )}
                    {resource.category && (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-periwinkle/20 text-gray-700">
                        {resource.category}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="text-gray-400 ml-2" size={20} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
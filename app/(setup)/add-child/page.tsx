'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

const childSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  birthDate: z.string().min(1, 'Birth date is required'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
})

type ChildFormData = z.infer<typeof childSchema>

const avatarOptions = ['🐻', '🦁', '🐰', '🦊', '🐨', '🐼', '🐸', '🦋']

export default function AddChildPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0])
  
  const { register, handleSubmit, formState: { errors } } = useForm<ChildFormData>({
    resolver: zodResolver(childSchema)
  })

  const onSubmit = async (data: ChildFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if we're in demo mode
      const isDemoUser = localStorage.getItem('demoUser') === 'true'
      const demoUserId = localStorage.getItem('userId')
      
      if (isDemoUser) {
        // Demo mode - just save to localStorage
        console.log('Demo mode: Saving child data locally')
        const childData = {
          id: `child-${Date.now()}`,
          parent_id: demoUserId,
          name: data.name,
          birth_date: data.birthDate,
          avatar_url: selectedAvatar,
          created_at: new Date().toISOString()
        }
        
        // Save child data to localStorage
        const existingChildren = JSON.parse(localStorage.getItem('demoChildren') || '[]')
        existingChildren.push(childData)
        localStorage.setItem('demoChildren', JSON.stringify(existingChildren))
        localStorage.setItem('currentChild', JSON.stringify(childData))
        
        router.push('/activities')
        return
      }

      // Try to use Supabase if not in demo mode
      const supabase = createClient()
      
      if (!supabase) {
        // Supabase not configured, use demo mode
        console.log('Supabase not configured, using demo mode')
        const childData = {
          id: `child-${Date.now()}`,
          parent_id: 'demo-user-123',
          name: data.name,
          birth_date: data.birthDate,
          avatar_url: selectedAvatar,
          created_at: new Date().toISOString()
        }
        
        localStorage.setItem('demoUser', 'true')
        localStorage.setItem('userId', 'demo-user-123')
        const existingChildren = JSON.parse(localStorage.getItem('demoChildren') || '[]')
        existingChildren.push(childData)
        localStorage.setItem('demoChildren', JSON.stringify(existingChildren))
        localStorage.setItem('currentChild', JSON.stringify(childData))
        
        router.push('/activities')
        return
      }
      
      // Supabase is configured, try to get user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // No user session, fall back to demo mode
        console.log('No user found, using demo mode')
        const childData = {
          id: `child-${Date.now()}`,
          parent_id: 'demo-user-123',
          name: data.name,
          birth_date: data.birthDate,
          avatar_url: selectedAvatar,
          created_at: new Date().toISOString()
        }
        
        localStorage.setItem('demoUser', 'true')
        localStorage.setItem('userId', 'demo-user-123')
        localStorage.setItem('demoChildren', JSON.stringify([childData]))
        localStorage.setItem('currentChild', JSON.stringify(childData))
        
        router.push('/activities')
        return
      }

      // For anonymous users, use a placeholder phone number
      const phoneNumber = user.phone || `anonymous_${user.id.slice(0, 8)}`
      
      const { error: parentError } = await supabase
        .from('parents')
        .upsert({
          id: user.id,
          phone: phoneNumber,
          onboarded: true,
          terms_accepted_at: new Date().toISOString()
        })

      if (parentError) {
        setError(parentError.message)
        return
      }

      const { error: childError } = await supabase
        .from('children')
        .insert({
          parent_id: user.id,
          name: data.name,
          birth_date: data.birthDate,
          avatar_url: selectedAvatar
        })

      if (childError) {
        setError(childError.message)
      } else {
        router.push('/activities')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const maxDate = format(new Date(), 'yyyy-MM-dd')
  const minDate = format(new Date(new Date().setFullYear(new Date().getFullYear() - 5)), 'yyyy-MM-dd')

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Add your child</h1>
          <p className="text-gray-600">Let's get to know your little one</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Choose an avatar
            </label>
            <div className="grid grid-cols-4 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`touch-button text-3xl border-2 ${
                    selectedAvatar === avatar
                      ? 'border-periwinkle bg-periwinkle/10'
                      : 'border-gray-200'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Child's Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              placeholder="Enter name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-periwinkle focus:border-transparent"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date
            </label>
            <input
              {...register('birthDate')}
              type="date"
              id="birthDate"
              min={minDate}
              max={maxDate}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-periwinkle focus:border-transparent"
              disabled={isLoading}
            />
            {errors.birthDate && (
              <p className="mt-2 text-sm text-red-600">{errors.birthDate.message}</p>
            )}
          </div>

          <div className="border-t pt-6">
            <label className="flex items-start">
              <input
                {...register('termsAccepted')}
                type="checkbox"
                className="mt-1 mr-3 h-5 w-5 text-periwinkle focus:ring-periwinkle border-gray-300 rounded"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-600">
                I accept the terms and conditions and privacy policy. I understand that Bida will use this information to provide personalized developmental guidance.
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="mt-2 text-sm text-red-600">{errors.termsAccepted.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </form>
      </div>

      <div className="bottom-action-area">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="w-full touch-button bg-periwinkle text-white disabled:opacity-50"
        >
          {isLoading ? 'Creating Profile...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
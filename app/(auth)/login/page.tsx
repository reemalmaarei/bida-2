'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const phoneSchema = z.object({
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .transform((val) => {
      // Remove all non-digit characters except + at the beginning
      const cleaned = val.replace(/\D/g, '')
      // Ensure it starts with country code (add +1 for US if no country code)
      if (!val.startsWith('+')) {
        return '+1' + cleaned
      }
      return '+' + cleaned
    })
})

type PhoneFormData = z.infer<typeof phoneSchema>

// Development mode flag - set to true to bypass SMS
const DEV_MODE = process.env.NODE_ENV === 'development'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors } } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema)
  })

  const onSubmit = async (data: PhoneFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('Phone authentication attempt:', data.phone)
      
      // Development mode bypass
      if (DEV_MODE && data.phone === '+11234567890') {
        console.log('DEV MODE: Bypassing SMS verification')
        localStorage.setItem('phoneNumber', data.phone)
        localStorage.setItem('devMode', 'true')
        router.push('/verify')
        return
      }

      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: data.phone,
        options: {
          channel: 'sms',
        }
      })

      if (error) {
        console.error('Supabase auth error:', error)
        setError(error.message)
      } else {
        console.log('OTP sent successfully')
        localStorage.setItem('phoneNumber', data.phone)
        router.push('/verify')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col justify-center p-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Welcome back!</h1>
          <p className="text-gray-600">Enter your phone number to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              placeholder="+1234567890"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-periwinkle focus:border-transparent"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {DEV_MODE && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600">
                Dev Mode: Use 1234567890 as phone number and 123456 as OTP code
              </p>
              <p className="text-xs text-blue-500 mt-1">
                Note: Anonymous auth must be enabled in Supabase dashboard
              </p>
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
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </button>
      </div>
    </div>
  )
}
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function VerifyPage() {
  const router = useRouter()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1)
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newCode.every(digit => digit !== '')) {
      handleVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (otpCode: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const phone = localStorage.getItem('phoneNumber')
      const isDevMode = localStorage.getItem('devMode') === 'true'
      const supabase = createClient()
      
      if (!phone) {
        router.push('/login')
        return
      }

      // Test mode bypass with anonymous sign-in
      if (isDevMode && otpCode === '123456') {
        console.log('TEST MODE: Using anonymous sign-in')
        localStorage.removeItem('devMode')
        
        // Sign in anonymously to create a real session
        const { data, error } = await supabase.auth.signInAnonymously()
        
        if (error) {
          console.error('Anonymous sign-in error:', error)
          setError('Test mode sign-in failed. Make sure anonymous auth is enabled in Supabase.')
          setCode(['', '', '', '', '', ''])
          inputRefs.current[0]?.focus()
        } else if (data.user) {
          console.log('Anonymous sign-in successful, user ID:', data.user.id)
          
          // Check if this anonymous user already has children
          const { data: parentData } = await supabase
            .from('parents')
            .select('*, children(*)')
            .eq('id', data.user.id)
            .single()

          if (parentData?.children && parentData.children.length > 0) {
            router.push('/activities')
          } else {
            router.push('/add-child')
          }
        }
        return
      }
      
      const { error, data } = await supabase.auth.verifyOtp({
        phone,
        token: otpCode,
        type: 'sms'
      })

      if (error) {
        console.error('OTP verification error:', error)
        setError(error.message)
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      } else if (data.user) {
        const { data: parentData } = await supabase
          .from('parents')
          .select('*, children(*)')
          .eq('id', data.user.id)
          .single()

        if (parentData?.children && parentData.children.length > 0) {
          router.push('/activities')
        } else {
          router.push('/add-child')
        }
      }
    } catch (err) {
      console.error('Unexpected error during verification:', err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    const phone = localStorage.getItem('phoneNumber')
    if (!phone) {
      router.push('/login')
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    })

    if (error) {
      setError(error.message)
    } else {
      setError(null)
    }
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex flex-col justify-center p-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Verify your phone</h1>
          <p className="text-gray-600">Enter the 6-digit code we sent to your phone</p>
        </div>

        <div className="flex justify-between mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-periwinkle focus:ring-2 focus:ring-periwinkle"
              disabled={isLoading}
            />
          ))}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={isLoading}
          className="text-periwinkle text-center"
        >
          Didn't receive code? Resend
        </button>
      </div>
    </div>
  )
}
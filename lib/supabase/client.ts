import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database'

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Check if the values are properly configured (not placeholders)
  return !!(
    url && 
    key && 
    !url.includes('your-project') && 
    !url.includes('your_project') &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    key.length > 20 &&
    !key.includes('your-anon-key') &&
    !key.includes('your_anon_key')
  )
}

export function createClient() {
  // Return null if Supabase is not properly configured
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured - using demo mode')
    return null
  }
  
  try {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null
  }
}
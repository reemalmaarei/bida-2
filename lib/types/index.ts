import { Database, DevelopmentalDomain, MilestoneResponse, ActivityState } from './database'

export type Parent = Database['public']['Tables']['parents']['Row']
export type Child = Database['public']['Tables']['children']['Row']
export type Milestone = Database['public']['Tables']['milestones']['Row']
export type TryItGuide = Database['public']['Tables']['try_it_guides']['Row']
export type MilestoneAssessment = Database['public']['Tables']['milestone_assessments']['Row']
export type Activity = Database['public']['Tables']['activities']['Row']
export type Resource = Database['public']['Tables']['resources']['Row']
export type Expert = Database['public']['Tables']['experts']['Row']

export type { DevelopmentalDomain, MilestoneResponse, ActivityState }

export const ASSESSMENT_MONTHS = [2, 4, 6, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 27, 30, 33, 36, 42, 48, 54, 60] as const
export type AssessmentMonth = typeof ASSESSMENT_MONTHS[number]

export const DOMAINS: DevelopmentalDomain[] = [
  'communication',
  'gross_motor', 
  'fine_motor',
  'problem_solving',
  'personal_social'
]

export const DOMAIN_LABELS: Record<DevelopmentalDomain, string> = {
  communication: 'Communication',
  gross_motor: 'Gross Motor',
  fine_motor: 'Fine Motor',
  problem_solving: 'Problem-Solving',
  personal_social: 'Personal-Social'
}

export const DOMAIN_COLORS: Record<DevelopmentalDomain, string> = {
  communication: 'yellow',
  gross_motor: 'green',
  fine_motor: 'orange',
  problem_solving: 'periwinkle',
  personal_social: 'pink'
}
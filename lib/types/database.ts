export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      parents: {
        Row: {
          id: string
          phone: string
          onboarded: boolean
          terms_accepted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone: string
          onboarded?: boolean
          terms_accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string
          onboarded?: boolean
          terms_accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      children: {
        Row: {
          id: string
          parent_id: string
          name: string
          birth_date: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          name: string
          birth_date: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          name?: string
          birth_date?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          assessment_month: number
          domain: DevelopmentalDomain
          title: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          assessment_month: number
          domain: DevelopmentalDomain
          title: string
          description?: string | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          assessment_month?: number
          domain?: DevelopmentalDomain
          title?: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
      }
      try_it_guides: {
        Row: {
          id: string
          milestone_id: string
          title: string
          instructions: string
          tips: string | null
          created_at: string
        }
        Insert: {
          id?: string
          milestone_id: string
          title: string
          instructions: string
          tips?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          milestone_id?: string
          title?: string
          instructions?: string
          tips?: string | null
          created_at?: string
        }
      }
      milestone_assessments: {
        Row: {
          id: string
          child_id: string
          milestone_id: string
          assessment_month: number
          response: MilestoneResponse
          notes: string | null
          completed_at: string
        }
        Insert: {
          id?: string
          child_id: string
          milestone_id: string
          assessment_month: number
          response: MilestoneResponse
          notes?: string | null
          completed_at?: string
        }
        Update: {
          id?: string
          child_id?: string
          milestone_id?: string
          assessment_month?: number
          response?: MilestoneResponse
          notes?: string | null
          completed_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          child_id: string
          milestone_assessment_id: string | null
          title: string
          description: string
          domain: DevelopmentalDomain
          state: ActivityState
          created_at: string
          completed_at: string | null
          saved_at: string | null
        }
        Insert: {
          id?: string
          child_id: string
          milestone_assessment_id?: string | null
          title: string
          description: string
          domain: DevelopmentalDomain
          state?: ActivityState
          created_at?: string
          completed_at?: string | null
          saved_at?: string | null
        }
        Update: {
          id?: string
          child_id?: string
          milestone_assessment_id?: string | null
          title?: string
          description?: string
          domain?: DevelopmentalDomain
          state?: ActivityState
          created_at?: string
          completed_at?: string | null
          saved_at?: string | null
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content?: string
          category?: string | null
          created_at?: string
        }
      }
      experts: {
        Row: {
          id: string
          name: string
          title: string | null
          specialty: string | null
          bio: string | null
          contact_info: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          title?: string | null
          specialty?: string | null
          bio?: string | null
          contact_info?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string | null
          specialty?: string | null
          bio?: string | null
          contact_info?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      developmental_domain: DevelopmentalDomain
      milestone_response: MilestoneResponse
      activity_state: ActivityState
    }
  }
}

export type DevelopmentalDomain = 'communication' | 'gross_motor' | 'fine_motor' | 'problem_solving' | 'personal_social'
export type MilestoneResponse = 'yes' | 'not_yet' | 'try_it'
export type ActivityState = 'active' | 'completed' | 'saved'
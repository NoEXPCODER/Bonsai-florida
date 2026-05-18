import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kezvvfocbpbyykgeohsw.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlenZ2Zm9jYnBieXlrZ2VvaHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDQ1MTIsImV4cCI6MjA5NDY4MDUxMn0.v0FbrzeNiRaoeuVtvojeclS90pIQwkzSjgBzpFFv4GU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export interface DbTree {
  id: string
  name: string
  species: string | null
  price: string
  level: string
  sun: string
  water: string
  notes: string | null
  image_url: string | null
  image_urls: string[] | null
  tree_code: string | null
  is_active: boolean
  created_at: string
}

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lqylqvpjxrwbsguicruu.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeWxxdnBqeHJ3YnNndWljcnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MDEyNzAsImV4cCI6MjA5MjM3NzI3MH0.Hh1VS94HscPufKA3Jbe7bJPv3K6cTPeK1Km4ovbK690'

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
  tree_code: string | null
  is_active: boolean
  created_at: string
}

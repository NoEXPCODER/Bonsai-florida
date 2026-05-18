import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kezvvfocbpbyykgeohsw.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlenZ2Zm9jYnBieXlrZ2VvaHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDQ1MTIsImV4cCI6MjA5NDY4MDUxMn0.v0FbrzeNiRaoeuVtvojeclS90pIQwkzSjgBzpFFv4GU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export interface DbSpecies {
  id: string
  name_en: string
  name_vi: string
  species_latin: string
  level: string
  sun_en: string
  sun_vi: string
  water_en: string
  water_vi: string
  care_en: string
  care_vi: string
  quick_facts_en?: string | null
  quick_facts_vi?: string | null
  light_en?: string | null
  light_vi?: string | null
  watering_en?: string | null
  watering_vi?: string | null
  fertilizer_en?: string | null
  fertilizer_vi?: string | null
  pruning_en?: string | null
  pruning_vi?: string | null
  repotting_en?: string | null
  repotting_vi?: string | null
  watch_for_en?: string | null
  watch_for_vi?: string | null
  florida_tips_en?: string | null
  florida_tips_vi?: string | null
  weekly_checklist_en?: string | null
  weekly_checklist_vi?: string | null
  created_at: string
}

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
  sold_image_url: string | null
  sold_note: string | null
  sold_at: string | null
  tree_code: string | null
  location_row: string | null
  location_tree: string | null
  species_id: string | null
  tree_species?: DbSpecies | null
  is_active: boolean
  created_at: string
}
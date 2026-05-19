import type { DbSpecies } from '@/lib/supabase'

export type SpeciesWithSlug = DbSpecies & {
  slug?: string | null
  difficulty?: string | null
  indoor_outdoor?: string | null
  care_image_url?: string | null
  latin_name?: string | null
}

export function getSpeciesLatin(species: SpeciesWithSlug): string {
  return species.species_latin || species.latin_name || ''
}

export function getSpeciesDifficulty(species: SpeciesWithSlug): string {
  return species.difficulty || species.level || 'Beginner Friendly'
}

export function makeSpeciesSlug(species: Pick<SpeciesWithSlug, 'name_en' | 'slug'>): string {
  if (species.slug?.trim()) return species.slug.trim()

  return species.name_en
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function findSpeciesBySlug(species: SpeciesWithSlug[], slug: string): SpeciesWithSlug | null {
  return species.find(item => makeSpeciesSlug(item) === slug) ?? null
}

export interface BonsaiTree {
  id: string
  name: string
  species: string
  level: 'Beginner Friendly' | 'Intermediate'
  sun: string
  water: string
  price: string
  bgFrom: string
  bgTo: string
}

export const TREES: BonsaiTree[] = [
  {
    id: 'tiger-ficus-1',
    name: 'Tiger Ficus',
    species: 'Ficus microcarpa',
    level: 'Beginner Friendly',
    sun: 'Bright indirect light',
    water: 'Every 2–3 days in summer',
    price: '$1,250',
    bgFrom: '#1a3c28',
    bgTo: '#2d5a3d',
  },
  {
    id: 'willow-ficus-1',
    name: 'Willow Ficus',
    species: 'Ficus salicaria',
    level: 'Beginner Friendly',
    sun: 'Morning sun or bright shade',
    water: 'Every 2 days in Florida heat',
    price: '$990',
    bgFrom: '#2d5a3d',
    bgTo: '#4a7a58',
  },
  {
    id: 'tiger-ficus-2',
    name: 'Tiger Ficus',
    species: 'Ficus microcarpa',
    level: 'Beginner Friendly',
    sun: 'Bright indirect light',
    water: 'Every 2–3 days in summer',
    price: '$1,100',
    bgFrom: '#0f2418',
    bgTo: '#1a3c28',
  },
  {
    id: 'panda-ficus',
    name: 'Panda Ficus',
    species: 'Ficus natalensis',
    level: 'Beginner Friendly',
    sun: 'Indirect light preferred',
    water: 'Every 3 days, mist leaves',
    price: '$875',
    bgFrom: '#3d6b4a',
    bgTo: '#5a8c6a',
  },
  {
    id: 'tiger-ficus-3',
    name: 'Tiger Ficus',
    species: 'Ficus microcarpa',
    level: 'Intermediate',
    sun: 'Full morning sun',
    water: 'Daily in peak summer',
    price: '$1,990',
    bgFrom: '#142318',
    bgTo: '#2d5a3d',
  },
  {
    id: 'willow-ficus-2',
    name: 'Willow Ficus',
    species: 'Ficus salicaria',
    level: 'Beginner Friendly',
    sun: 'Morning sun or bright shade',
    water: 'Every 2 days in Florida heat',
    price: '$1,500',
    bgFrom: '#244d38',
    bgTo: '#3d6b4a',
  },
]

export interface CareGuideEntry {
  slug: string
  name: string
  latin: string
  aliases: string[]
  difficulty: 'Beginner' | 'Beginner-Intermediate' | 'Intermediate'
  floridaFit: string
  summary: string
  quick: {
    light: string
    water: string
    placement: string
    beginnerTip: string
  }
  details: {
    title: string
    body: string[]
  }[]
}

export const CARE_GUIDES: CareGuideEntry[] = [
  {
    slug: 'tiger-bark-ficus',
    name: 'Tiger Bark Ficus',
    latin: 'Ficus microcarpa',
    aliases: ['tiger ficus', 'ficus', 'ginseng ficus', 'ficus retusa'],
    difficulty: 'Beginner',
    floridaFit: 'Excellent for South Florida patios and bright indoor spots.',
    summary: 'The most forgiving tropical bonsai for beginners. It handles warmth, humidity, pruning, and small watering mistakes better than most trees.',
    quick: {
      light: 'Bright shade outside or bright window indoors. Morning sun is ideal.',
      water: 'Water when the top inch starts to dry. Do not keep soggy.',
      placement: 'Patio, lanai, under light shade cloth, or bright east/south window.',
      beginnerTip: 'Keep it in one stable spot for two weeks after purchase.',
    },
    details: [
      {
        title: 'Daily care',
        body: [
          'Check soil with your finger instead of watering by the calendar.',
          'In Florida heat, small pots may need water every 1-2 days outside.',
          'Indoors, it may only need water every 3-6 days depending on light and air conditioning.',
        ],
      },
      {
        title: 'Pruning and shape',
        body: [
          'Let new shoots grow 5-8 leaves, then trim back to 2 leaves.',
          'Remove weak crossing branches so light reaches the inside.',
          'Ficus back-buds well, so small mistakes usually recover.',
        ],
      },
      {
        title: 'Warning signs',
        body: [
          'Yellow leaves usually mean too much water, too little light, or a sudden move.',
          'Dry crispy leaves usually mean the root ball went too dry.',
          'Sticky leaves can mean scale insects; wipe leaves and check stems closely.',
        ],
      },
    ],
  },
  {
    slug: 'willow-leaf-ficus',
    name: 'Willow Leaf Ficus',
    latin: 'Ficus salicaria',
    aliases: ['willow leaf', 'narrow leaf ficus', 'mexican ficus'],
    difficulty: 'Beginner',
    floridaFit: 'Very strong in Florida humidity and great for small-leaf bonsai styling.',
    summary: 'A Florida-friendly ficus with small narrow leaves. It grows fast, responds well to trimming, and is easy to rebuild after stress.',
    quick: {
      light: 'Morning sun or bright shade.',
      water: 'Keep evenly moist but never sitting in water.',
      placement: 'Best outdoors in bright shade; can adapt indoors with strong light.',
      beginnerTip: 'Trim often during warm months to keep the canopy tight.',
    },
    details: [
      {
        title: 'Water and humidity',
        body: [
          'This ficus likes more even moisture than jade or juniper.',
          'During hot windy days, check the soil daily.',
          'If indoors, keep away from cold air vents that dry the foliage.',
        ],
      },
      {
        title: 'Growth habit',
        body: [
          'It grows quickly in Florida, so light trimming every few weeks can help.',
          'Defoliate only when the tree is strong, warm, and actively growing.',
          'Use clip-and-grow for natural movement instead of heavy wiring.',
        ],
      },
    ],
  },
  {
    slug: 'dwarf-jade',
    name: 'Dwarf Jade',
    latin: 'Portulacaria afra',
    aliases: ['jade', 'small leaf jade', 'elephant bush', 'portulacaria'],
    difficulty: 'Beginner',
    floridaFit: 'Great for warm bright areas and owners who sometimes forget to water.',
    summary: 'A succulent bonsai with thick leaves that store water. It is tough, clean, and one of the safest starter trees for bright spots.',
    quick: {
      light: 'Very bright light; gentle sun is helpful.',
      water: 'Let soil dry more than ficus before watering.',
      placement: 'Bright patio or sunny window protected from cold.',
      beginnerTip: 'When unsure, wait one more day before watering.',
    },
    details: [
      {
        title: 'Watering',
        body: [
          'Dwarf jade rots faster from overwatering than underwatering.',
          'Water deeply, then let the soil become mostly dry.',
          'Use fast-draining bonsai soil and never leave water in the tray.',
        ],
      },
      {
        title: 'Pruning',
        body: [
          'Pinch or cut long shoots to encourage branching.',
          'Branches are soft, so wire carefully and check often.',
          'Heavy pruning is safest during warm active growth.',
        ],
      },
    ],
  },
  {
    slug: 'chinese-elm',
    name: 'Chinese Elm',
    latin: 'Ulmus parvifolia',
    aliases: ['elm', 'lacebark elm'],
    difficulty: 'Beginner-Intermediate',
    floridaFit: 'Works well outdoors with bright light and consistent watering.',
    summary: 'A classic bonsai species with fine branching and small leaves. It is adaptable but wants more outdoor light than most indoor trees.',
    quick: {
      light: 'Morning sun to bright outdoor light.',
      water: 'Water when the surface begins to dry.',
      placement: 'Best outside on a bench, patio, or bright protected area.',
      beginnerTip: 'Do not keep it in a dim room; weak light causes weak growth.',
    },
    details: [
      {
        title: 'Seasonal care',
        body: [
          'In Florida, Chinese elm may stay semi-evergreen instead of fully dormant.',
          'Reduce fertilizer during cooler slow-growth periods.',
          'Protect from extreme drying wind after repotting.',
        ],
      },
      {
        title: 'Refinement',
        body: [
          'Trim new shoots back regularly to build fine branch structure.',
          'Rotate the tree weekly so all sides get light.',
          'Remove large leaves when the tree is strong to improve scale over time.',
        ],
      },
    ],
  },
  {
    slug: 'juniper',
    name: 'Juniper',
    latin: 'Juniperus species',
    aliases: ['shimpaku', 'procumbens nana', 'green mound juniper'],
    difficulty: 'Beginner-Intermediate',
    floridaFit: 'Outdoor-only tree; needs sun and airflow.',
    summary: 'The classic bonsai look. Junipers are strong outdoors, but they decline indoors because they need real sun and moving air.',
    quick: {
      light: 'Outdoor sun, ideally morning sun with afternoon protection.',
      water: 'Water when soil is slightly dry; never bone dry for long.',
      placement: 'Outside only: bench, patio, or bright airy garden spot.',
      beginnerTip: 'Do not keep juniper indoors except for short display periods.',
    },
    details: [
      {
        title: 'Outdoor requirement',
        body: [
          'Junipers need direct outdoor light to stay dense and healthy.',
          'Good airflow helps prevent pests and fungal problems.',
          'A covered dark porch is usually not enough light.',
        ],
      },
      {
        title: 'Styling',
        body: [
          'Pinch or cut overlong tips, but do not remove all green from a branch.',
          'Juniper branches without foliage usually die back.',
          'Wire slowly and protect bark on older branches.',
        ],
      },
    ],
  },
  {
    slug: 'fukien-tea',
    name: 'Fukien Tea',
    latin: 'Carmona retusa',
    aliases: ['carmona', 'ehretia microphylla'],
    difficulty: 'Intermediate',
    floridaFit: 'Good in warm humidity but sensitive to change.',
    summary: 'A pretty tropical tree with small leaves and tiny white flowers. It rewards steady care but reacts quickly to missed watering or low light.',
    quick: {
      light: 'Bright shade or strong filtered light.',
      water: 'Keep lightly moist; avoid both drought and soggy soil.',
      placement: 'Warm protected patio or very bright indoor window.',
      beginnerTip: 'Avoid moving it repeatedly; stability matters.',
    },
    details: [
      {
        title: 'Stability',
        body: [
          'Fukien tea often drops leaves after moving from one environment to another.',
          'Give it bright light, steady moisture, and time before changing anything else.',
          'Avoid cold drafts and dry air conditioning vents.',
        ],
      },
      {
        title: 'Pests',
        body: [
          'Check for scale, mites, and mealybugs around leaf joints.',
          'Wipe leaves gently and isolate the tree if pests appear.',
          'Healthy light and airflow are the best prevention.',
        ],
      },
    ],
  },
  {
    slug: 'dwarf-schefflera',
    name: 'Dwarf Schefflera',
    latin: 'Schefflera arboricola',
    aliases: ['hawaiian umbrella', 'umbrella tree', 'schefflera'],
    difficulty: 'Beginner',
    floridaFit: 'Very forgiving in warm bright shade.',
    summary: 'A tough tropical bonsai with umbrella-shaped leaves. It is easy for beginners and handles Florida humidity well.',
    quick: {
      light: 'Bright shade or filtered patio light.',
      water: 'Water when the top inch dries.',
      placement: 'Covered patio, lanai, or bright indoor area.',
      beginnerTip: 'Use pruning more than wiring; branches can be brittle.',
    },
    details: [
      {
        title: 'Care rhythm',
        body: [
          'Schefflera tolerates indoor conditions better than many outdoor bonsai.',
          'It grows fastest in warm weather with bright indirect light.',
          'Keep leaves clean so the tree can use available light.',
        ],
      },
      {
        title: 'Design',
        body: [
          'Aerial roots can form in humid Florida conditions.',
          'Trim long shoots back to build a compact canopy.',
          'Avoid heavy wire bends on older woody branches.',
        ],
      },
    ],
  },
  {
    slug: 'bougainvillea',
    name: 'Bougainvillea',
    latin: 'Bougainvillea species',
    aliases: ['bougie', 'paper flower'],
    difficulty: 'Beginner-Intermediate',
    floridaFit: 'Excellent outdoors in South Florida sun.',
    summary: 'A colorful tropical bonsai that loves heat, sun, and fast-draining soil. It flowers best when not overwatered.',
    quick: {
      light: 'Strong sun to bright outdoor light.',
      water: 'Let soil approach dry between watering.',
      placement: 'Sunny patio or garden bench.',
      beginnerTip: 'Too much water and too much shade reduce flowers.',
    },
    details: [
      {
        title: 'Flowering',
        body: [
          'Bougainvillea blooms best with strong light and slightly drier cycles.',
          'Fertilize lightly during active growth, but avoid pushing weak leggy shoots.',
          'After flowering, trim back to keep the shape compact.',
        ],
      },
      {
        title: 'Handling',
        body: [
          'Branches can be brittle, so wire carefully.',
          'Watch thorns when pruning and moving the tree.',
          'Repot during warm weather when the tree is actively growing.',
        ],
      },
    ],
  },
  {
    slug: 'brazilian-rain-tree',
    name: 'Brazilian Rain Tree',
    latin: 'Pithecellobium tortum',
    aliases: ['rain tree', 'brazilian raintree'],
    difficulty: 'Intermediate',
    floridaFit: 'Strong tropical performer in warm humid conditions.',
    summary: 'A beautiful tropical bonsai with compound leaves and textured bark. It likes warmth, moisture, and careful pruning.',
    quick: {
      light: 'Morning sun or bright filtered light.',
      water: 'Keep evenly moist, especially in hot weather.',
      placement: 'Warm patio with bright filtered light.',
      beginnerTip: 'Protect it from cold snaps and hard drying.',
    },
    details: [
      {
        title: 'Water and light',
        body: [
          'Rain trees use a lot of water during active warm growth.',
          'Leaves may fold at night or during stress; this can be normal.',
          'If leaves stay closed during the day, check water and roots.',
        ],
      },
      {
        title: 'Pruning',
        body: [
          'Let shoots extend, then cut back to shape.',
          'Thorns can appear on new growth, so prune carefully.',
          'Avoid hard root work outside warm growing periods.',
        ],
      },
    ],
  },
  {
    slug: 'buttonwood',
    name: 'Buttonwood',
    latin: 'Conocarpus erectus',
    aliases: ['florida buttonwood', 'silver buttonwood'],
    difficulty: 'Intermediate',
    floridaFit: 'Native Florida character tree for bright outdoor spaces.',
    summary: 'A coastal Florida favorite with rugged bark and deadwood character. It wants outdoor light, warmth, and careful watering.',
    quick: {
      light: 'Strong outdoor light; protect from harshest afternoon stress if in a small pot.',
      water: 'Water thoroughly, then let the surface begin to dry.',
      placement: 'Outdoor bench or sunny patio with airflow.',
      beginnerTip: 'Do not let a newly collected or repotted buttonwood dry hard.',
    },
    details: [
      {
        title: 'Florida care',
        body: [
          'Buttonwood likes heat and humidity but still needs drainage.',
          'Salt and wind tolerance do not mean the bonsai pot can dry out completely.',
          'Protect from unusual cold snaps.',
        ],
      },
      {
        title: 'Design',
        body: [
          'Use its natural rugged trunk and deadwood as the main feature.',
          'Trim new growth to build pads gradually.',
          'Avoid overworking roots and branches at the same time.',
        ],
      },
    ],
  },
  {
    slug: 'serissa',
    name: 'Serissa',
    latin: 'Serissa japonica',
    aliases: ['snow rose', 'tree of a thousand stars'],
    difficulty: 'Intermediate',
    floridaFit: 'Possible in bright protected areas; dislikes sudden changes.',
    summary: 'A small flowering bonsai with fine leaves. It is attractive but sensitive, so it needs stable light and careful watering.',
    quick: {
      light: 'Bright indirect light or gentle morning sun.',
      water: 'Keep lightly moist, not soggy.',
      placement: 'Protected patio or bright window away from drafts.',
      beginnerTip: 'Expect leaf drop if moved; correct care slowly, not all at once.',
    },
    details: [
      {
        title: 'Common issues',
        body: [
          'Serissa can drop leaves from movement, cold, drought, or overwatering.',
          'Make one correction at a time so you know what helped.',
          'Use a stable spot with bright light and mild airflow.',
        ],
      },
      {
        title: 'Pruning',
        body: [
          'Trim after flowering or when shoots stretch out of shape.',
          'Fine branches can be built with regular small cuts.',
          'Avoid heavy pruning on a weak or recently moved tree.',
        ],
      },
    ],
  },
  {
    slug: 'podocarpus',
    name: 'Podocarpus',
    latin: 'Podocarpus macrophyllus',
    aliases: ['buddhist pine', 'yew pine'],
    difficulty: 'Beginner-Intermediate',
    floridaFit: 'Excellent outdoor evergreen for Florida landscapes and bonsai.',
    summary: 'A durable evergreen with clean dark foliage. It grows slower than ficus but is steady and reliable outside.',
    quick: {
      light: 'Morning sun to bright shade.',
      water: 'Water when topsoil starts to dry.',
      placement: 'Outdoor patio, bench, or bright protected garden area.',
      beginnerTip: 'Be patient; it refines slowly but steadily.',
    },
    details: [
      {
        title: 'Growth',
        body: [
          'Podocarpus grows slower than tropical ficus, so avoid constant heavy trimming.',
          'Let shoots extend slightly before cutting back.',
          'Rotate for even light and balanced growth.',
        ],
      },
      {
        title: 'Health',
        body: [
          'Yellowing can come from too much water or poor drainage.',
          'Brown tips can happen after drought, salt buildup, or harsh sun stress.',
          'Flush the pot occasionally with clean water if fertilizer salts build up.',
        ],
      },
    ],
  },
  {
    slug: 'azalea',
    name: 'Azalea',
    latin: 'Rhododendron species',
    aliases: ['satsuki azalea', 'rhododendron'],
    difficulty: 'Intermediate',
    floridaFit: 'Best with acidic soil, bright shade, and careful watering.',
    summary: 'A flowering bonsai prized for spring color. It needs acidic soil and steady moisture, so it is less forgiving than ficus.',
    quick: {
      light: 'Bright shade or morning sun.',
      water: 'Do not let the root ball dry hard.',
      placement: 'Cooler bright protected patio spot.',
      beginnerTip: 'Use azalea/rhododendron-friendly acidic fertilizer.',
    },
    details: [
      {
        title: 'Flower care',
        body: [
          'After flowers fade, remove spent blooms to conserve energy.',
          'Major pruning is usually done after flowering.',
          'Do not let flower beauty distract from watering needs.',
        ],
      },
      {
        title: 'Soil and water',
        body: [
          'Azaleas prefer acidic, moisture-retentive but draining soil.',
          'Drying out can damage fine roots quickly.',
          'Avoid very hard alkaline water when possible.',
        ],
      },
    ],
  },
  {
    slug: 'japanese-maple',
    name: 'Japanese Maple',
    latin: 'Acer palmatum',
    aliases: ['maple', 'acer'],
    difficulty: 'Intermediate',
    floridaFit: 'Needs protection from Florida heat and afternoon sun.',
    summary: 'A classic deciduous bonsai with beautiful leaves. In Florida it needs careful placement, shade, and heat protection.',
    quick: {
      light: 'Morning sun only; protect from afternoon heat.',
      water: 'Keep evenly moist in warm weather.',
      placement: 'Cool bright shade, protected from hot wind.',
      beginnerTip: 'Leaf scorch means too much heat, sun, wind, or drought stress.',
    },
    details: [
      {
        title: 'Heat management',
        body: [
          'Japanese maple is not as easy in South Florida as tropical species.',
          'Use shade cloth or a protected east-facing spot.',
          'Small pots heat quickly, so check water often in warm months.',
        ],
      },
      {
        title: 'Pruning',
        body: [
          'Refine with careful seasonal pruning instead of constant cutting.',
          'Protect new spring leaves from wind and intense sun.',
          'Avoid heavy work when the tree is heat-stressed.',
        ],
      },
    ],
  },
  {
    slug: 'black-pine',
    name: 'Black Pine',
    latin: 'Pinus thunbergii',
    aliases: ['japanese black pine', 'pine'],
    difficulty: 'Intermediate',
    floridaFit: 'Outdoor tree for sun, airflow, and experienced seasonal work.',
    summary: 'A powerful classic bonsai species. It is beautiful but more technical because candle, needle, and timing work matter.',
    quick: {
      light: 'Full outdoor sun with airflow.',
      water: 'Water deeply when soil begins to dry.',
      placement: 'Sunny outdoor bench, not indoors.',
      beginnerTip: 'Learn seasonal pine timing before heavy pruning.',
    },
    details: [
      {
        title: 'Outdoor care',
        body: [
          'Black pine must live outdoors with strong light.',
          'Weak light causes long needles and weak buds.',
          'Use fast-draining soil and avoid constantly wet roots.',
        ],
      },
      {
        title: 'Technique',
        body: [
          'Pine care depends on timing: candle work, needle thinning, and bud selection.',
          'Do not treat pine like ficus; old bare branches may not bud back.',
          'Ask before major cuts if you are unsure.',
        ],
      },
    ],
  },
  {
    slug: 'olive',
    name: 'Olive',
    latin: 'Olea europaea',
    aliases: ['european olive', 'olive tree'],
    difficulty: 'Beginner-Intermediate',
    floridaFit: 'Good in bright sun with excellent drainage.',
    summary: 'A Mediterranean bonsai with small leaves and aged bark character. It likes sun, airflow, and drying slightly between watering.',
    quick: {
      light: 'Strong sun to very bright outdoor light.',
      water: 'Let the top layer dry before watering again.',
      placement: 'Sunny patio or open outdoor bench.',
      beginnerTip: 'Avoid wet soil; olive wants drainage and sun.',
    },
    details: [
      {
        title: 'Watering',
        body: [
          'Olive tolerates slight dryness better than soggy soil.',
          'In a small bonsai pot, still check regularly during hot weather.',
          'Use a gritty mix to keep roots oxygenated.',
        ],
      },
      {
        title: 'Pruning',
        body: [
          'Trim active shoots to keep compact shape.',
          'Olive can back-bud on older wood when healthy and sunny.',
          'Avoid heavy work during weak or shaded growth.',
        ],
      },
    ],
  },
]

export function findCareGuideForTree(tree: { name: string; species: string | null }): CareGuideEntry {
  const haystack = `${tree.name} ${tree.species ?? ''}`.toLowerCase()
  return CARE_GUIDES.find(guide =>
    haystack.includes(guide.name.toLowerCase()) ||
    guide.aliases.some(alias => haystack.includes(alias.toLowerCase())) ||
    haystack.includes(guide.latin.toLowerCase())
  ) ?? CARE_GUIDES[0]
}

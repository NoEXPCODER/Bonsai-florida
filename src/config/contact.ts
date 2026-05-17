/*
 * BONSAI FLORIDA — Contact & Social Configuration
 * ------------------------------------------------
 * Edit this ONE file to update phone, email, and social links
 * everywhere across the entire website.
 */

export const CONTACT = {
  phone: {
    display: '561-312-9576',
    tel: 'tel:5613129576',
    sms: 'sms:5613129576',
  },
  email: {
    address: 'nathanvan10@gmail.com',
    href: 'mailto:nathanvan10@gmail.com',
  },
  social: {
    instagram: {
      label: 'Instagram',
      handle: '@bonsaiflorida',
      url: 'https://www.instagram.com/bonsaiflorida',
      description: 'Best for tree photos',
    },
    tiktok: {
      label: 'TikTok',
      handle: '@bonsai.florida',
      url: 'https://www.tiktok.com/@bonsai.florida',
      description: 'Best for short bonsai videos',
    },
    facebook: {
      label: 'Facebook',
      handle: 'Bonsai Florida',
      url: 'https://www.facebook.com/bonsaiflorida',
      description: 'Best for events and updates',
    },
    youtube: {
      label: 'YouTube',
      handle: '@bonsaiflorida7925',
      url: 'https://www.youtube.com/@bonsaiflorida7925',
      description: 'Best for care videos',
    },
  },
  location: 'Palm Beach, Florida',
  year: '2026',
} as const

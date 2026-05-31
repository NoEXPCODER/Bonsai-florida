/*
 * BONSAI FLORIDA — Contact & Social Configuration
 * ------------------------------------------------
 * Edit this ONE file to update phone, email, and social links
 * everywhere across the entire website.
 */

export const CONTACT = {
  phone: {
    display: '561-301-1586',
    tel: 'tel:5613011586',
    sms: 'sms:5613011586',
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
      url: 'https://facebook.com/thanh.van.161009',
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
  // 12419 77th Pl N, West Palm Beach FL 33412 — update with exact coords from Google Maps if needed
  coordinates: { lat: 26.7800, lng: -80.2300 },
  year: '2026',
} as const

export const siteConfig = {
  publicArea: 'West Palm Beach / Royal Palm Beach area',
  publicZip: '33411',
  // Replace this with the live Google Calendar Appointment Schedule URL in Vercel.
  bookingUrl: process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL || '#',
} as const

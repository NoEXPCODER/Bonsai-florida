import { CONTACT } from '@/config/contact'

export const siteConfig = {
  publicArea: 'Palm Beach',
  publicZip: '33412',
  bookingUrl: '/visit',
  textBookingUrl: `${CONTACT.phone.sms}?&body=${encodeURIComponent('Hi, I want to request a Bonsai Florida garden visit. Please text me back to confirm a time.')}`,
} as const

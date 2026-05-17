import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bonsai Florida | Tropical Bonsai in Palm Beach, Florida',
  description:
    'Beginner-friendly tropical bonsai, local guidance, and peaceful garden visits in Palm Beach, Florida. Call or text 561-312-9576.',
  keywords: [
    'bonsai Florida',
    'tropical bonsai',
    'Palm Beach bonsai',
    'ficus bonsai',
    'beginner bonsai',
    'South Florida bonsai',
  ],
  openGraph: {
    title: 'Bonsai Florida | Tropical Bonsai in Palm Beach',
    description: 'Beginner-friendly tropical bonsai in Palm Beach, Florida.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}

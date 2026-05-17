import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ConnectSection from '@/components/ConnectSection'
import BonsaiCollection from '@/components/BonsaiCollection'
import CareGuide from '@/components/CareGuide'
import VisitSection from '@/components/VisitSection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero — brand intro + primary CTAs */}
        <Hero />

        {/* 2. Connect — all contact methods, large tap targets */}
        <ConnectSection />

        {/* 3. Available Bonsai — tree cards with care details */}
        <BonsaiCollection />

        {/* 4. Beginner Care Guide — simple, reassuring blocks */}
        <CareGuide />

        {/* 5. Visit — garden appointment CTA */}
        <VisitSection />
      </main>
      <Footer />
    </>
  )
}

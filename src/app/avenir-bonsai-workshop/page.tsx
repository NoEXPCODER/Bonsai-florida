import type { Metadata } from 'next'
import WorkshopProposal from '@/components/proposals/WorkshopProposal'
import { avenirWorkshopProposal } from '@/data/proposals/avenir-bonsai-workshop'

export const metadata: Metadata = {
  title: 'Discover Bonsai | Avenir Community Workshop Proposal',
  description:
    'A Japanese-inspired beginner bonsai workshop proposal for Avenir residents from Bonsai Florida.',
}

export default function AvenirBonsaiWorkshopPage() {
  return <WorkshopProposal proposal={avenirWorkshopProposal} />
}

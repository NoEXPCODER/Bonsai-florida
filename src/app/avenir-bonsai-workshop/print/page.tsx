import type { Metadata } from 'next'
import WorkshopProposal from '@/components/proposals/WorkshopProposal'
import { avenirWorkshopProposal } from '@/data/proposals/avenir-bonsai-workshop'

export const metadata: Metadata = {
  title: 'Print Proposal | Avenir Bonsai Workshop',
  description: 'Print-friendly Bonsai Florida workshop proposal for Avenir.',
}

export default function AvenirBonsaiWorkshopPrintPage() {
  return <WorkshopProposal proposal={avenirWorkshopProposal} variant="print" />
}

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { COOKIE_NAME, validateSession } from '@/lib/session'
import AvenirProposalSender from './AvenirProposalSender'

export default async function AvenirProposalAdminPage() {
  const cookieStore = await cookies()
  const rawToken = cookieStore.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)

  if (!session) redirect('/admin')

  return <AvenirProposalSender />
}

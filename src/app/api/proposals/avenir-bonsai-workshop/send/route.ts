import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME, validateSession } from '@/lib/session'
import { getAvenirWorkshopEmailHtml } from '@/lib/proposal-email'
import { getResendClient } from '@/lib/resend'

const DEFAULT_SUBJECT = 'Bonsai Workshop Idea for Avenir Residents'
const DEFAULT_FROM = 'Bonsai Florida <onboarding@resend.dev>'
const DEFAULT_TO = 'nathanvan10@gmail.com'

function getBaseUrl(req: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (configured) {
    return configured.startsWith('http') ? configured : `https://${configured}`
  }

  return req.nextUrl.origin
}

export async function POST(req: NextRequest) {
  const rawToken = req.cookies.get(COOKIE_NAME)?.value
  const session = await validateSession(rawToken)

  if (!session) {
    return NextResponse.json({ error: 'Staff login required' }, { status: 401 })
  }

  let body: {
    to?: string
    from?: string
    subject?: string
  } = {}

  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const resend = getResendClient()
  const baseUrl = getBaseUrl(req)
  const html = await getAvenirWorkshopEmailHtml(baseUrl)
  const to = body.to?.trim() || DEFAULT_TO
  const from = body.from?.trim() || process.env.RESEND_FROM_EMAIL || DEFAULT_FROM
  const subject = body.subject?.trim() || DEFAULT_SUBJECT

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  })

  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  return NextResponse.json({ id: data?.id, to, from, subject })
}

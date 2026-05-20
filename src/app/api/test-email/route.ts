import { NextResponse } from 'next/server'
import { sendCustomerConfirmation, sendAdminNotification } from '@/lib/email'

// Temporary test endpoint — DELETE after confirming email works
export async function GET() {
  const fake = {
    id: 'test-001',
    full_name: 'Test User',
    email: 'nathanvan10@gmail.com',
    phone: '5615550100',
    purpose: 'Buy a Bonsai',
    budget_range: 'Under $50',
    experience_level: 'Beginner',
    visit_goal: null,
    visitor_count: 1,
    notes: 'This is a test email — ignore.',
    selected_tree_ids: null,
    appointment_start: new Date(Date.now() + 86_400_000).toISOString(),
    appointment_end: new Date(Date.now() + 86_400_000 + 1_800_000).toISOString(),
  }

  await Promise.all([
    sendCustomerConfirmation(fake),
    sendAdminNotification(fake),
  ])

  return NextResponse.json({ ok: true, message: 'Test emails dispatched — check nathanvan10@gmail.com and Vercel logs.' })
}

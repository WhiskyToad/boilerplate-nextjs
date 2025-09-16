import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/emails/email-service'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    
    // Verify this is an INSERT event on users table
    if (payload.type !== 'INSERT' || payload.table !== 'users') {
      return NextResponse.json({ message: 'Event type not supported' }, { status: 200 })
    }

    const user = payload.record
    if (!user?.email) {
      return NextResponse.json({ error: 'No email found in user data' }, { status: 400 })
    }

    // Extract name from user metadata
    const name = user.user_metadata?.full_name || 
                 user.user_metadata?.name || 
                 user.email.split('@')[0]

    // Send welcome email
    const emailResult = await emailService.sendWelcomeEmail(user.email, {
      name,
      email: user.email,
      loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    })

    if (!emailResult.success) {
      console.error('Welcome email failed:', emailResult.error)
      return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 })
    }

    console.log('Welcome email sent successfully to:', user.email)
    return NextResponse.json({ 
      success: true, 
      messageId: emailResult.messageId,
      email: user.email 
    })

  } catch (error) {
    console.error('Auth webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
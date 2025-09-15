import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
        <!-- Header -->
        <div style="background-color: #f1f5f9; padding: 32px 20px; text-align: center;">
          <h1 style="color: #1e293b; font-size: 24px; margin: 0;">Welcome to Boost Toad 🎉</h1>
          <p style="color: #475569; font-size: 16px; margin: 8px 0 0;">I'm glad you're here</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 20px; color: #334155; font-size: 16px; line-height: 1.6;">
          <p>Hey ${name},</p>

          <p>
            Thanks a ton for signing up for <strong>Boost Toad</strong>!  
            I'm Steven the Toad, the founder. I built this because I was losing users without knowing why, and needed a simpler way to collect feedback.
          </p>

          <p>I'd love to hear from you:</p>
          <ul style="padding-left: 20px; margin: 16px 0;">
            <li>👉 What made you sign up today?</li>
            <li>👉 What kind of feedback/problems are you hoping Boost Toad will help you solve?</li>
          </ul>

          <p>Even a quick one-liner reply would be super helpful. Together, we can make this awesome. 🚀</p>

          <p style="margin-top: 24px; font-weight: bold;">And just so you know:</p>
          <p>💌 My inbox is always open — if you hit a snag, feel stuck, or want to share an idea, just hit reply and I'll get back to you quickly.</p>
          <p>Or you can also use the widget for an even quicker simpler way!</p>
          <p>🚀 Together, we can make Boost Toad even better!</p>
          <p style="margin-top: 32px;">Cheers,<br/>Steven the Toad 🐸<br/>Founder @ Boost Toad</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">
            You're receiving this because you signed up for Boost Toad.
          </p>
        </div>
      </div>
    `;

    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'welcome@yourdomain.com',
      to: user.email,
      subject: 'Welcome to Feedback Widget! 🎉',
      html: htmlContent
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    console.log('Welcome email sent successfully to:', user.email)
    return NextResponse.json({ 
      success: true, 
      messageId: data?.id,
      email: user.email 
    })

  } catch (error) {
    console.error('Auth webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { siteConfig } from '@/config/site-config'

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
    const brandName = siteConfig.name;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
        <!-- Header -->
        <div style="background-color: #f1f5f9; padding: 32px 20px; text-align: center;">
          <h1 style="color: #1e293b; font-size: 24px; margin: 0;">Welcome to ${brandName} 🎉</h1>
          <p style="color: #475569; font-size: 16px; margin: 8px 0 0;">Glad you're here — let's build a 5-minute habit</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 20px; color: #334155; font-size: 16px; line-height: 1.6;">
          <p>Hey ${name},</p>

          <p>
            Thanks for signing up for <strong>${brandName}</strong>! You're set to start journaling in just a few minutes.
          </p>

          <p>Quick ways to get value fast:</p>
          <ul style="padding-left: 20px; margin: 16px 0;">
            <li>👉 Write your first entry — use today's prompt to get started.</li>
            <li>👉 Turn on reminders so you never miss a day.</li>
            <li>👉 Revisit your timeline after a few entries to spot patterns.</li>
          </ul>

          <p style="margin-top: 24px;">Have feedback or need help? Just reply — we read every message.</p>
          <p style="margin-top: 32px;">Cheers,<br/>The ${brandName} Team</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">
            You're receiving this because you signed up for ${brandName}.
          </p>
        </div>
      </div>
    `;

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'welcome@yourdomain.com',
      to: user.email,
      subject: `Welcome to ${brandName}! 🎉`,
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

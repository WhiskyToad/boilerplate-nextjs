import { Resend } from 'resend'
import { WelcomeEmail } from './templates/WelcomeEmail'
import { PasswordResetEmail } from './templates/PasswordResetEmail'
import { EmailVerificationEmail } from './templates/EmailVerificationEmail'
import { NotificationEmail } from './templates/NotificationEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string
  subject: string
  html?: string
  text?: string
  from?: string
}

export interface WelcomeEmailData {
  name: string
  email: string
  loginUrl?: string
}

export interface PasswordResetData {
  name: string
  resetUrl: string
  expiryHours?: number
}

export interface EmailVerificationData {
  name: string
  verificationUrl: string
  expiryHours?: number
}

export interface NotificationData {
  name: string
  title: string
  message: string
  actionUrl?: string
  actionText?: string
}

class EmailService {
  private defaultFrom = process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com'

  async sendEmail(options: EmailOptions) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured - email not sent')
      return { success: false, error: 'Email service not configured' }
    }

    try {
      const { data, error } = await resend.emails.send({
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.html || '',
        text: options.text,
      })

      if (error) {
        console.error('Email send error:', error)
        return { success: false, error: error.message }
      }

      console.log('Email sent successfully:', data?.id)
      return { success: true, messageId: data?.id }
    } catch (error) {
      console.error('Email service error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown email error' 
      }
    }
  }

  async sendWelcomeEmail(to: string, data: WelcomeEmailData) {
    const html = WelcomeEmail(data)
    
    return this.sendEmail({
      to,
      subject: 'Welcome to Your SaaS Platform! 🎉',
      html,
    })
  }

  async sendPasswordResetEmail(to: string, data: PasswordResetData) {
    const html = PasswordResetEmail(data)
    
    return this.sendEmail({
      to,
      subject: 'Reset Your Password',
      html,
    })
  }

  async sendEmailVerificationEmail(to: string, data: EmailVerificationData) {
    const html = EmailVerificationEmail(data)
    
    return this.sendEmail({
      to,
      subject: 'Verify Your Email Address',
      html,
    })
  }

  async sendNotificationEmail(to: string, data: NotificationData) {
    const html = NotificationEmail(data)
    
    return this.sendEmail({
      to,
      subject: data.title,
      html,
    })
  }

  // Bulk email sending (with rate limiting)
  async sendBulkEmails(emails: EmailOptions[], delayMs: number = 100) {
    const results: Array<{
      email: string
      success: boolean
      messageId?: string
      error?: string
    }> = []
    
    for (const email of emails) {
      const result = await this.sendEmail(email)
      results.push({ 
        email: email.to, 
        success: result.success, 
        messageId: result.success ? result.messageId : undefined,
        error: result.success ? undefined : result.error
      })
      
      // Add delay to respect rate limits
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
    
    return results
  }
}

export const emailService = new EmailService()
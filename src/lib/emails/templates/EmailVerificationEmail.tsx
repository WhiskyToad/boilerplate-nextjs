import { EmailVerificationData } from '../email-service'

export function EmailVerificationEmail({ name, verificationUrl, expiryHours = 24 }: EmailVerificationData): string {
  const currentYear = new Date().getFullYear()
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">
              Verify Your Email Address ✉️
            </h1>
            <p style="color: #d1fae5; font-size: 16px; margin: 10px 0 0; opacity: 0.9;">
              One more step to complete your account setup
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 40px 30px; color: #374151; line-height: 1.6;">
            <p style="font-size: 16px; margin: 0 0 20px;">
              Hello <strong>${name}</strong>,
            </p>

            <p style="font-size: 16px; margin: 0 0 20px;">
              Thanks for signing up! We need to verify your email address to complete your account setup and ensure the security of your account.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Verify Email Address
              </a>
            </div>

            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px 20px; margin: 30px 0; border-radius: 4px;">
              <p style="margin: 0; color: #047857; font-size: 14px;">
                <strong>⏰ This link expires in ${expiryHours} hours</strong><br>
                Please verify your email address soon to avoid any service interruptions.
              </p>
            </div>

            <p style="font-size: 16px; margin: 20px 0;">
              Once verified, you'll have full access to all features and can start using your account immediately.
            </p>

            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                <strong>Trouble clicking the button?</strong><br>
                Copy and paste this URL into your browser:<br>
                <span style="word-break: break-all; color: #4f46e5;">${verificationUrl}</span>
              </p>
            </div>

            <p style="font-size: 14px; margin: 30px 0 0; color: #6b7280;">
              If you didn't create an account with us, please ignore this email.
            </p>

            <p style="font-size: 16px; margin: 20px 0 0;">
              Best regards,<br>
              <strong>The Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              This is an automated verification email. Please do not reply.
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin: 10px 0 0;">
              © ${currentYear} Your SaaS Platform. All rights reserved.
            </p>
          </div>

        </div>
      </body>
    </html>
  `
}
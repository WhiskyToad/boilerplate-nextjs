import { PasswordResetData } from '../email-service'

export function PasswordResetEmail({ name, resetUrl, expiryHours = 24 }: PasswordResetData): string {
  const currentYear = new Date().getFullYear()
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">
              Reset Your Password 🔐
            </h1>
            <p style="color: #fef3c7; font-size: 16px; margin: 10px 0 0; opacity: 0.9;">
              We received a request to reset your password
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 40px 30px; color: #374151; line-height: 1.6;">
            <p style="font-size: 16px; margin: 0 0 20px;">
              Hello <strong>${name}</strong>,
            </p>

            <p style="font-size: 16px; margin: 0 0 20px;">
              We received a request to reset the password for your account. If you made this request, click the button below to set a new password.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Reset Your Password
              </a>
            </div>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 30px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>⏰ This link expires in ${expiryHours} hours</strong><br>
                For security reasons, this password reset link will only work for a limited time.
              </p>
            </div>

            <p style="font-size: 16px; margin: 20px 0;">
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>

            <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                <strong>Trouble clicking the button?</strong><br>
                Copy and paste this URL into your browser:<br>
                <span style="word-break: break-all; color: #4f46e5;">${resetUrl}</span>
              </p>
            </div>

            <p style="font-size: 16px; margin: 30px 0 0;">
              Best regards,<br>
              <strong>The Security Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              This is an automated security email. Please do not reply.
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
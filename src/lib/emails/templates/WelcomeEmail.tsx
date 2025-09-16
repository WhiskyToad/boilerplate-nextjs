import { WelcomeEmailData } from '../email-service'

export function WelcomeEmail({ name, email, loginUrl }: WelcomeEmailData): string {
  const currentYear = new Date().getFullYear()
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">
              Welcome to Your SaaS Platform! 🎉
            </h1>
            <p style="color: #e2e8f0; font-size: 16px; margin: 10px 0 0; opacity: 0.9;">
              We're excited to have you on board
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 40px 30px; color: #374151; line-height: 1.6;">
            <p style="font-size: 16px; margin: 0 0 20px;">
              Hello <strong>${name}</strong>,
            </p>

            <p style="font-size: 16px; margin: 0 0 20px;">
              Welcome to our platform! We're thrilled to have you join our community and can't wait to see what you'll build.
            </p>

            <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px; color: #1f2937; font-size: 18px;">🚀 Get Started</h3>
              <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                <li style="margin-bottom: 8px;">Complete your profile setup</li>
                <li style="margin-bottom: 8px;">Explore the dashboard features</li>
                <li style="margin-bottom: 8px;">Check out our documentation</li>
                <li style="margin-bottom: 8px;">Join our community</li>
              </ul>
            </div>

            ${loginUrl ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Access Your Dashboard
                </a>
              </div>
            ` : ''}

            <p style="font-size: 16px; margin: 30px 0 20px;">
              If you have any questions or need help getting started, don't hesitate to reach out. We're here to help you succeed!
            </p>

            <p style="font-size: 16px; margin: 20px 0 0;">
              Best regards,<br>
              <strong>The Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              You're receiving this email because you signed up for our platform.
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
import { NotificationData } from '../email-service'

export function NotificationEmail({ name, title, message, actionUrl, actionText }: NotificationData): string {
  const currentYear = new Date().getFullYear()
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">
              ${title}
            </h1>
          </div>

          <!-- Body -->
          <div style="padding: 40px 30px; color: #374151; line-height: 1.6;">
            <p style="font-size: 16px; margin: 0 0 20px;">
              Hello <strong>${name}</strong>,
            </p>

            <div style="font-size: 16px; margin: 20px 0;">
              ${message.split('\n').map(paragraph => 
                `<p style="margin: 0 0 15px;">${paragraph}</p>`
              ).join('')}
            </div>

            ${actionUrl && actionText ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${actionUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  ${actionText}
                </a>
              </div>
            ` : ''}

            <p style="font-size: 16px; margin: 30px 0 0;">
              Best regards,<br>
              <strong>The Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              You're receiving this notification because of your account activity.
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
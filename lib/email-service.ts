// Email service for sending notifications
// This is a placeholder implementation - you'll need to integrate with your preferred email service

export interface EmailData {
  to: string
  subject: string
  body: string
  html?: string
}

export class EmailService {
  private static instance: EmailService

  private constructor() {}

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendWelcomeEmail(email: string, fullName: string, password: string): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to: email,
        subject: 'Welcome to A-SEARCH - Your Account Has Been Approved',
        body: this.generateWelcomeEmailText(fullName, email, password),
        html: this.generateWelcomeEmailHTML(fullName, email, password)
      }

      // TODO: Replace this with your actual email service integration
      // Examples: SendGrid, AWS SES, Resend, etc.
      
      console.log('Sending welcome email:', {
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body
      })

      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return false
    }
  }

  async sendRejectionEmail(email: string, fullName: string, reason?: string): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to: email,
        subject: 'A-SEARCH Account Request Update',
        body: this.generateRejectionEmailText(fullName, reason),
        html: this.generateRejectionEmailHTML(fullName, reason)
      }

      console.log('Sending rejection email:', {
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body
      })

      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    } catch (error) {
      console.error('Error sending rejection email:', error)
      return false
    }
  }

  private generateWelcomeEmailText(fullName: string, email: string, password: string): string {
    return `Dear ${fullName},

Your account request has been approved!

Your login credentials:
Email: ${email}
Password: ${password}

Please change your password after your first login for security purposes.

You can now access the A-SEARCH platform and start using the system.

If you have any questions or need assistance, please contact our support team.

Best regards,
A-SEARCH Team`
  }

  private generateWelcomeEmailHTML(fullName: string, email: string, password: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to A-SEARCH</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .credentials { background: #e5e7eb; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .password { font-family: monospace; background: #1f2937; color: #f9fafb; padding: 8px 12px; border-radius: 4px; display: inline-block; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to A-SEARCH!</h1>
            <p>Your account has been approved</p>
        </div>
        <div class="content">
            <p>Dear ${fullName},</p>
            
            <p>Great news! Your account request has been approved and your account is now active.</p>
            
            <div class="credentials">
                <h3>Your Login Credentials:</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> <span class="password">${password}</span></p>
            </div>
            
            <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
            
            <p>You can now access the A-SEARCH platform and start using all the features available to you.</p>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>A-SEARCH Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`
  }

  private generateRejectionEmailText(fullName: string, reason?: string): string {
    return `Dear ${fullName},

Thank you for your interest in A-SEARCH.

We regret to inform you that your account request has not been approved at this time.

${reason ? `Reason: ${reason}` : 'Please contact our support team for more information about this decision.'}

If you believe this decision was made in error or if you have additional information to provide, please contact our support team.

We appreciate your understanding.

Best regards,
A-SEARCH Team`
  }

  private generateRejectionEmailHTML(fullName: string, reason?: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A-SEARCH Account Request Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .reason { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Account Request Update</h1>
        </div>
        <div class="content">
            <p>Dear ${fullName},</p>
            
            <p>Thank you for your interest in A-SEARCH.</p>
            
            <p>We regret to inform you that your account request has not been approved at this time.</p>
            
            ${reason ? `
            <div class="reason">
                <h3>Reason:</h3>
                <p>${reason}</p>
            </div>
            ` : '<p>Please contact our support team for more information about this decision.</p>'}
            
            <p>If you believe this decision was made in error or if you have additional information to provide, please contact our support team.</p>
            
            <p>We appreciate your understanding.</p>
            
            <p>Best regards,<br>
            <strong>A-SEARCH Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance() 
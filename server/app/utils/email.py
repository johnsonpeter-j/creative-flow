import smtplib
from email.message import EmailMessage
from app.core.config import settings

# email details
EMAIL_ADDRESS = settings.EMAIL_ADDRESS
EMAIL_PASSWORD = settings.EMAIL_PASSWORD

# company details
COMPANY_NAME = settings.COMPANY_NAME
COMPANY_ADDRESS = settings.COMPANY_ADDRESS

FORGOT_PASSWORD = "forgot_password"

mail_template = {
    FORGOT_PASSWORD: """
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <!-- Header Section -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #CD9C74 0%, #E4C5AC 100%); padding: 50px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">Password Reset</h1>
                            <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.95); font-size: 16px; line-height: 1.5;">We received a request to reset your password</p>
                        </td>
                    </tr>
                    
                    <!-- Content Section -->
                    <tr>
                        <td style="padding: 50px 40px; background-color: #FAF0E6;">
                            <p style="margin: 0 0 20px 0; color: #5A4A3A; font-size: 16px; line-height: 1.6;">Hello {{user_name}},</p>
                            
                            <p style="margin: 0 0 25px 0; color: #5A4A3A; font-size: 16px; line-height: 1.6;">
                                You recently requested to reset your password for your account. Click the button below to reset it.
                            </p>
                            
                            <!-- Reset Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{RESET_LINK}}" style="display: inline-block; background-color: #CD9C74; color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(205, 156, 116, 0.3); transition: all 0.3s ease;">Reset Password</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 15px 0; color: #5A4A3A; font-size: 14px; line-height: 1.6;">
                                <strong>This link will expire in 24 hours.</strong>
                            </p>
                            
                            <p style="margin: 0 0 20px 0; color: #5A4A3A; font-size: 14px; line-height: 1.6;">
                                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                            </p>
                            
                            <!-- Alternative Link Section -->
                            <div style="margin-top: 35px; padding: 20px; background-color: #ffffff; border-radius: 12px; border-left: 4px solid #CD9C74;">
                                <p style="margin: 0 0 10px 0; color: #5A4A3A; font-size: 13px; line-height: 1.5;">
                                    <strong>Button not working?</strong> Copy and paste this link into your browser:
                                </p>
                                <p style="margin: 0; color: #CD9C74; font-size: 13px; word-break: break-all; line-height: 1.5;">
                                    {{RESET_LINK}}
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer Section -->
                    <tr>
                        <td style="padding: 40px; background-color: #F5EBE0; text-align: center; border-top: 1px solid #E8D5C4;">
                            <p style="margin: 0 0 10px 0; color: #8B7355; font-size: 14px; line-height: 1.5;">
                                Need help? <a href="mailto:support@yourcompany.com" style="color: #CD9C74; text-decoration: none; font-weight: 600;">Contact Support</a>
                            </p>
                            <p style="margin: 15px 0 0 0; color: #A89080; font-size: 12px; line-height: 1.5;">
                                © 2024 {COMPANY_NAME}. All rights reserved.
                            </p>
                            <p style="margin: 8px 0 0 0; color: #A89080; font-size: 12px; line-height: 1.5;">
                                {COMPANY_ADDRESS}
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Legal Text -->
                <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <p style="margin: 0; color: #999999; font-size: 11px; line-height: 1.5;">
                                This is an automated message, please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""
}

def build_email_body(body_type: str, message_data: list[dict]) -> str:
    """
    Build email body by replacing placeholders in template with message data.
    
    Args:
        body_type: Type of email template (e.g., 'forgot_password')
        message_data: List of dictionaries containing key-value pairs for template replacement
                     Example: [{"key": "RESET_LINK", "value": "https://example.com/reset?token=abc123"}]
    
    Returns:
        Processed email body string with placeholders replaced
    """
    if body_type not in mail_template:
        raise ValueError(f"Email template '{body_type}' not found")
    
    template = mail_template[body_type]
    
    # Replace placeholders in template with values from message_data
    # Template uses {{KEY}} format, so we need to construct {{KEY}} for replacement
    for data in message_data:
        key = data.get("key", "")
        value = data.get("value", "")
        # Construct placeholder in format {{KEY}} (double curly braces)
        placeholder = "{{" + key + "}}"
        
        if placeholder in template:
            template = template.replace(placeholder, str(value))
    
    return template



def send_email(
    to_address: str,
    subject: str,
    body_type: str,
    message_data: list[dict]
):
    msg = EmailMessage()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_address
    msg["Subject"] = subject

    body = build_email_body(body_type, message_data)

    # All email templates are HTML, so always set as HTML alternative
    # with a plain text fallback for email clients that don't support HTML
    msg.set_content("Your email client does not support HTML. Please view this email in an HTML-compatible email client.")
    msg.add_alternative(body, subtype="html")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)

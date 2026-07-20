import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || 'smtp.ethereal.email';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const emailFrom = process.env.EMAIL_FROM || 'no-reply@skillforge.ai';

let transporter: nodemailer.Transporter | null = null;

if (smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

export const sendVerificationEmail = async (email: string, name: string, code: string): Promise<boolean> => {
  const subject = 'Verify your email - SkillForge AI';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4f46e5; text-align: center;">Welcome to SkillForge AI</h2>
      <p>Hi ${name},</p>
      <p>Thank you for signing up! Please verify your email address by entering the verification code below on the confirmation page:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; padding: 10px 20px; background-color: #f3f4f6; border-radius: 4px; border: 1px dashed #4f46e5; color: #4f46e5;">
          ${code}
        </span>
      </div>
      <p>If you did not sign up for this account, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b; text-align: center;">SkillForge AI - Elevate your productivity and career.</p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: emailFrom,
        to: email,
        subject,
        html,
      });
      return true;
    } catch (error) {
      console.error('Error sending verification email via SMTP:', error);
    }
  }

  // Console Fallback for easy testing
  console.log('\n=======================================');
  console.log(`[EMAIL SEND SIMULATION] To: ${email}`);
  console.log(`[SUBJECT] ${subject}`);
  console.log(`[VERIFICATION CODE] ${code}`);
  console.log('=======================================\n');
  return true;
};

export const sendPasswordResetEmail = async (email: string, name: string, token: string): Promise<boolean> => {
  const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  const subject = 'Reset your password - SkillForge AI';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4f46e5; text-align: center;">Reset Your Password</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to set a new password. This link will expire in 1 hour.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b; text-align: center;">SkillForge AI - Elevate your productivity and career.</p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: emailFrom,
        to: email,
        subject,
        html,
      });
      return true;
    } catch (error) {
      console.error('Error sending reset email via SMTP:', error);
    }
  }

  // Console Fallback for easy testing
  console.log('\n=======================================');
  console.log(`[EMAIL SEND SIMULATION] To: ${email}`);
  console.log(`[SUBJECT] ${subject}`);
  console.log(`[RESET LINK] ${resetLink}`);
  console.log('=======================================\n');
  return true;
};

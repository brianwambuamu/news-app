import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

interface SendCredentialsParams {
  to: string;
  name: string;
  email: string;
  password: string;
}

export async function sendCredentialsEmail({
  to,
  name,
  email,
  password,
}: SendCredentialsParams): Promise<void> {
  const loginUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">Welcome to the News Portal, ${name}</h2>
      <p>An administrator has created a reporter account for you. Use the credentials below to log in.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Email</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border: 1px solid #ddd;">Temporary Password</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${password}</td>
        </tr>
      </table>
      <p>
        <a href="${loginUrl}" style="background: #1a1a1a; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Log in
        </a>
      </p>
      <p style="color: #555; font-size: 13px;">
        For security, please log in and change your password as soon as possible.
      </p>
    </div>
  `;

  // If SMTP isn't configured, fall back to logging so local dev isn't blocked.
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(
      '[email] SMTP not configured. Logging credentials instead of sending an email:'
    );
    console.warn(`[email] To: ${to} | Email: ${email} | Password: ${password}`);
    return;
  }

  const mailer = getTransporter();

  await mailer.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject: 'Your News Portal account credentials',
    html,
  });
}

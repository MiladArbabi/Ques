// backend/adapters/sendGrid/index.ts
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export interface EmailOptions { to: string; subject: string; html: string; text?: string }
export async function sendEmail(opts: EmailOptions) {
  await sgMail.send({ from: process.env.SENDGRID_FROM_EMAIL!, ...opts });
}
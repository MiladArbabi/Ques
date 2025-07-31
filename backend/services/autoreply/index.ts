// backend/services/autoreply/index.ts
import { sendEmail, EmailOptions } from '../../adapters/sendGrid';
import { sendSms, SmsOptions } from '../../adapters/twilio';

interface AutoReplyContext {
  toEmail: string;
  toPhone: string;
  ticketId: string;
  customerName?: string;
}

/**
 * Render email HTML template (could use a template engine or simple interpolation)
 */
function renderEmailTemplate(ctx: AutoReplyContext): string {
  return `
    <h1>Thanks for contacting us, ${ctx.customerName || 'Customer'}!</h1>
    <p>We've received your request (#${ctx.ticketId}). Our team will get back to you shortly.</p>
  `;
}

/**
 * Render SMS text template
 */
function renderSmsTemplate(ctx: AutoReplyContext): string {
  return `Hi ${ctx.customerName || ''}, we've received your support request (#${ctx.ticketId}). Reply STOP to opt-out.`;
}

/**
 * Send auto-reply via both email and SMS
 */
export async function sendAutoReply(ctx: AutoReplyContext): Promise<void> {
  const emailOpts: EmailOptions = {
    to: ctx.toEmail,
    subject: 'We received your request',
    html: renderEmailTemplate(ctx),
    text: undefined,
  };

  const smsOpts: SmsOptions = {
    to: ctx.toPhone,
    body: renderSmsTemplate(ctx),
  };

  await Promise.all([
    sendEmail(emailOpts),
    sendSms(smsOpts),
  ]);
}
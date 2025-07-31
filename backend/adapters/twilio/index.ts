// backend/adapters/twilio/index.ts
import twilio from 'twilio';
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export interface SmsOptions { to: string; body: string; }
export async function sendSms(opts: SmsOptions) {
  await client.messages.create({ from: process.env.TWILIO_PHONE_NUMBER!, ...opts });
}

// backend/adapters/reamaze/index.ts
import axios from 'axios';
const ROOT = process.env.REAMAZE_API_URL!.replace(/\/+$/, '');
const EMAIL    = process.env.REAMAZE_EMAIL!;
const API_TOKEN = process.env.REAMAZE_API_TOKEN!;

export interface Ticket { id: string; subject: string; source: string;}

export class ReamazeAPI {
  async listTickets(): Promise<Ticket[]> {
    try {
      console.log(`[ReamazeAPI] listTickets → GET ${ROOT}/api/v1/conversations.json`);
      const resp = await axios.get(
        `${ROOT}/api/v1/conversations.json`,
        {
          auth: { username: EMAIL, password: API_TOKEN },
          headers: { Accept: 'application/json' }
        }
      );
      const convos = resp.data.conversations as any[];
      return convos.map(c => ({
        id: String(c.id),
        subject: c.subject || c.preview || '(no subject)',
        source: 'reamaze',
      }));
    } catch (err) {
      console.error('[ReamazeAPI] listTickets failed:', err);
      throw new Error(`Reamaze listTickets error: ${(err as Error).message}`);
    }
  }

async getTicket(id: string): Promise<Ticket> {
    try {
      console.log(`[ReamazeAPI] getTicket → GET ${ROOT}/api/v1/conversations/${id}.json`);
      const resp = await axios.get(
        `${ROOT}/api/v1/conversations/${id}.json`,
        {
          auth: { username: EMAIL, password: API_TOKEN },
          headers: { Accept: 'application/json' }
        }
      );
      const c = resp.data.conversation as any;
      return {
        id: String(c.id),
        subject: c.subject || c.preview || '(no subject)',
        source: 'reamaze',
      };
    } catch (err) {
      console.error('[ReamazeAPI] getTicket failed:', err);
      throw new Error(`Reamaze getTicket error: ${(err as Error).message}`);
    }
  }
}
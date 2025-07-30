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
      console.log('[ReamazeAPI] response.data.conversations:', resp.data.conversations);
      return resp.data.conversations.map((c: any) => ({
        id: c.id.toString(),
        subject: c.subject || c.preview,  // adapt to whatever field holds your “ticket” summary
        source: 'reamaze',
      }));
    } catch (err) {
      console.error('[ReamazeAPI] listTickets failed:', err);
      throw new Error(`Reamaze listTickets error: ${(err as Error).message}`);
    }
  }

async getTicket(id: string): Promise<Ticket> {
    try {
      console.log(`[ReamazeAPI] getTicket → GET ${ROOT}/tickets/${id}.json`);
      const resp = await axios.get(
         `${ROOT}/api/v1/conversations.json`,
        {
          auth: { username: EMAIL, password: API_TOKEN },
          headers: { Accept: 'application/json' }
        }
      );
      console.log('[ReamazeAPI] getTicket response.data.ticket:', resp.data.conversations);
      const t = resp.data.conversations;
      return t.map((c: any) => ({
        id: c.id.toString(),
        subject: c.subject || c.preview || '(no subject)',
        source: 'reamaze',
      }));
    } catch (err) {
      console.error('[ReamazeAPI] getTicket failed:', err);
      throw new Error(`Reamaze getTicket error: ${(err as Error).message}`);
    }
  }
}
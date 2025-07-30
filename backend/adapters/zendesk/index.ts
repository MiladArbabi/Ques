// backend/adapters/zendesk/index.ts
import axios from 'axios';

const BASE_URL = process.env.ZENDESK_API_URL!.replace(/\/+$/, '');
const EMAIL    = process.env.ZENDESK_EMAIL!;
const TOKEN    = process.env.ZENDESK_API_TOKEN!;

export class ZendeskAPI {
  private base = process.env.ZENDESK_API_URL!;
  private auth = {
    username: `${process.env.ZENDESK_EMAIL}/token`,
    password: process.env.ZENDESK_API_TOKEN!,
  };

  async listTickets(): Promise<Array<{id:string;subject:string}>> {
    try {
      console.log(`[ZendeskAPI] listTickets → GET ${BASE_URL}/tickets.json`);
      console.log(`[ZendeskAPI] auth:`, this.auth);
      const resp = await axios.get(`${BASE_URL}/tickets.json`, { auth: this.auth });
      console.log('[ZendeskAPI] response.data.tickets:', resp.data.tickets);
      return resp.data.tickets.map((t: any) => ({
        id: t.id.toString(),
        subject: t.subject,
      }));
    } catch (err) {
      console.error('[ZendeskAPI] listTickets failed:', err);
      throw new Error(`Zendesk listTickets error: ${(err as Error).message}`);
    }
  }

 async getTicket(id: string): Promise<{id:string;subject:string}> {
    try {
      console.log(`[ZendeskAPI] getTicket → GET ${BASE_URL}/tickets/${id}.json`);
      const resp = await axios.get(`${BASE_URL}/tickets/${id}.json`, { auth: this.auth });
      console.log('[ZendeskAPI] getTicket response.data.ticket:', resp.data.ticket);
      const t = resp.data.ticket;
      return { id: t.id.toString(), subject: t.subject };
    } catch (err) {
      console.error('[ZendeskAPI] getTicket failed:', err);
      throw new Error(`Zendesk getTicket error: ${(err as Error).message}`);
    }
  }
}

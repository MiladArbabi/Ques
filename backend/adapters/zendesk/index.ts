// backend/adapters/zendesk/index.ts
import axios from 'axios';

const BASE_URL = process.env.ZENDESK_API_URL!;
const EMAIL    = process.env.ZENDESK_EMAIL!;
const TOKEN    = process.env.ZENDESK_API_TOKEN!;

export class ZendeskAPI {
  private auth = { username: `${EMAIL}/token`, password: TOKEN };
  private base = BASE_URL;

  /** Fetches all tickets */
  async listTickets(): Promise<{ id: string; subject: string }[]> {
    const resp = await axios.get(`${this.base}/tickets.json`, { auth: this.auth });
    return resp.data.tickets.map((t: any) => ({
      id: t.id.toString(),
      subject: t.subject,
    }));
  }

  /** Fetch a single ticket */
  async getTicket(id: string): Promise<any> {
    const resp = await axios.get(`${this.base}/tickets/${id}.json`, { auth: this.auth });
    return resp.data.ticket;
  }
}

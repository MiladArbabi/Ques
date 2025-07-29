// backend/adapters/reamaze/index.ts
import axios from 'axios';

const BASE_URL = process.env.REAMAZE_API_URL!;
const API_KEY  = process.env.REAMAZE_API_KEY!;

export class ReamazeAPI {
  private base   = BASE_URL;
  private headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type':  'application/json',
  };

  /** Fetches all tickets (Re:amaze calls them “messages”) */
  async listTickets(): Promise<{ id: string; subject: string }[]> {
    const resp = await axios.get(`${this.base}/messages.json`, { headers: this.headers });
    return resp.data.messages.map((m: any) => ({
      id: m.id.toString(),
      subject: m.subject,
    }));
  }

  /** Fetch a single message/ticket */
  async getTicket(id: string): Promise<any> {
    const resp = await axios.get(`${this.base}/tickets/${id}.json`, { headers: this.headers });
    return resp.data.ticket;
  }
}

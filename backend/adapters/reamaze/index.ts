// backend/adapters/reamaze/index.ts
import axios from 'axios';

const BASE_URL = process.env.REAMAZE_API_URL;
const API_KEY  = process.env.REAMAZE_API_KEY;

export async function getTicket(id: string) {
  const resp = await axios.get(`${BASE_URL}/tickets/${id}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return resp.data;
}
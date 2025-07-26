import axios from 'axios';

const BASE_URL = process.env.ZENDESK_API_URL!;
const EMAIL    = process.env.ZENDESK_EMAIL!;
const TOKEN    = process.env.ZENDESK_API_TOKEN!;

export async function getTicket(id: string) {
  const resp = await axios.get(
    \`\${BASE_URL}/tickets/\${id}.json\`,
    {
      auth: { username: \`\${EMAIL}/token\`, password: TOKEN }
    }
  );
  return resp.data.ticket;
}

// TODO: add createTicket, updateTicket, listTickets…

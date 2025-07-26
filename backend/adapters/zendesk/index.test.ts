import axios from 'axios';
import { getTicket } from './index';

jest.mock('axios');
const mocked = axios as jest.Mocked<typeof axios>;

describe('Zendesk Adapter', () => {
  it('calls the correct URL', async () => {
    mocked.get.mockResolvedValue({ data: { ticket: { id: '123' } } });
    const ticket = await getTicket('123');
    expect(axios.get).toHaveBeenCalledWith(
      \`\${process.env.ZENDESK_API_URL}/tickets/123.json\`,
      expect.objectContaining({
        auth: expect.objectContaining({
          username: expect.stringContaining('/token'),
          password: process.env.ZENDESK_API_TOKEN
        })
      })
    );
    expect(ticket).toEqual({ id: '123' });
  });
});

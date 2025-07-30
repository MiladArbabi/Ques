process.env.ZENDESK_API_URL   = 'https://zendesk.example.com';
process.env.ZENDESK_EMAIL     = 'user@example.com';
process.env.ZENDESK_API_TOKEN = 'secret-token';
import axios from 'axios';
import { ZendeskAPI } from './index';

jest.mock('axios');
const mocked = axios as jest.Mocked<typeof axios>;

describe('Zendesk Adapter', () => {
  let api: ZendeskAPI;
  const baseUrl = 'https://zendesk.example.com';
  const email = 'user@example.com';
  const token = 'secret-token';

  beforeEach(() => {
    process.env.ZENDESK_API_URL = baseUrl;
    process.env.ZENDESK_EMAIL = email;
    process.env.ZENDESK_API_TOKEN = token;
    api = new ZendeskAPI();
    mocked.get.mockReset();
  });

  it('listTickets should fetch tickets and map id and subject', async () => {
    const mockResponse = {
      data: {
        tickets: [
          { id: 1, subject: 'Hi' },
          { id: 2, subject: 'Hello' },
        ],
      },
    };
    mocked.get.mockResolvedValue(mockResponse as any);

    const tickets = await api.listTickets();

    expect(mocked.get).toHaveBeenCalledWith(
      `${baseUrl}/tickets.json`,
      { auth: { username: `${email}/token`, password: token } }
    );
    expect(tickets).toEqual([
      { id: '1', subject: 'Hi' },
      { id: '2', subject: 'Hello' },
    ]);
  });

  it('getTicket should fetch single ticket', async () => {
    const mockResponse = {
      data: { ticket: { id: 42, subject: 'Test' } },
    };
    mocked.get.mockResolvedValue(mockResponse as any);

    const ticket = await api.getTicket('42');

    expect(mocked.get).toHaveBeenCalledWith(
      `${baseUrl}/tickets/42.json`,
      { auth: { username: `${email}/token`, password: token } }
    );
    expect(ticket).toEqual({ id: '42', subject: 'Test' });
  });

  it('listTickets should propagate errors thrown by axios', async () => {
    mocked.get.mockRejectedValue(new Error('boom'));
    await expect(api.listTickets()).rejects.toThrow('boom');
  });

  it('getTicket should propagate errors thrown by axios', async () => {
    mocked.get.mockRejectedValue(new Error('boom'));
    await expect(api.getTicket('42')).rejects.toThrow('boom');
  });
});

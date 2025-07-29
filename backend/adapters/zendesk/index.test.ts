// backend/adapters/zendesk/index.test.ts
import axios from 'axios';
import { ZendeskAPI } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ZendeskAPI', () => {
  let api: ZendeskAPI;
  const baseUrl = 'https://zendesk.example.com';
  const email = 'user@example.com';
  const token = 'secret-token';

  beforeAll(() => {
    // set env vars to satisfy non-null assertions
    process.env.ZENDESK_API_URL = baseUrl;
    process.env.ZENDESK_EMAIL = email;
    process.env.ZENDESK_API_TOKEN = token;
  });

  beforeEach(() => {
    api = new ZendeskAPI();
    mockedAxios.get.mockReset();
  });

  it('listTickets should fetch tickets and map id and subject', async () => {
    const fakeResponse = {
      data: {
        tickets: [
          { id: 1, subject: 'Test 1' },
          { id: 2, subject: 'Test 2' },
        ],
      },
    };
    mockedAxios.get.mockResolvedValue(fakeResponse);

    const tickets = await api.listTickets();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${baseUrl}/tickets.json`,
      { auth: { username: `${email}/token`, password: token } }
    );
    expect(tickets).toEqual([
      { id: '1', subject: 'Test 1' },
      { id: '2', subject: 'Test 2' },
    ]);
  });

  it('getTicket should fetch single ticket', async () => {
    const fakeTicket = { id: 42, subject: 'Single' };
    const fakeResponse = { data: { ticket: fakeTicket } };
    mockedAxios.get.mockResolvedValue(fakeResponse);

    const ticket = await api.getTicket('42');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${baseUrl}/tickets/42.json`,
      { auth: { username: `${email}/token`, password: token } }
    );
    expect(ticket).toEqual(fakeTicket);
  });

  it('listTickets should propagate errors thrown by axios', async () => {
    mockedAxios.get.mockRejectedValue(new Error('network error'));
    await expect(api.listTickets()).rejects.toThrow('network error');
  });
});
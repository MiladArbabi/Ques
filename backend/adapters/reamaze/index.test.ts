// backend/adapters/reamaze/index.test.ts
import axios from 'axios';
import { ReamazeAPI } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ReamazeAPI', () => {
  let api: ReamazeAPI;
  const baseUrl = 'https://reamaze.example.com';
  const apiKey = 'reamaze-key';

  beforeAll(() => {
    // set env vars
    process.env.REAMAZE_API_URL = baseUrl;
    process.env.REAMAZE_API_KEY = apiKey;
  });

  beforeEach(() => {
    api = new ReamazeAPI();
    mockedAxios.get.mockReset();
  });

  it('listTickets should fetch messages and map id and subject', async () => {
    const fakeResponse = {
      data: {
        messages: [
          { id: 10, subject: 'Msg 1' },
          { id: 11, subject: 'Msg 2' },
        ],
      },
    };
    mockedAxios.get.mockResolvedValue(fakeResponse);

    const tickets = await api.listTickets();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${baseUrl}/messages.json`,
      { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
    );
    expect(tickets).toEqual([
      { id: '10', subject: 'Msg 1' },
      { id: '11', subject: 'Msg 2' },
    ]);
  });

  it('getTicket should fetch a single ticket', async () => {
    const fakeTicket = { id: 5, subject: 'One' };
    const fakeResponse = { data: { ticket: fakeTicket } };
    mockedAxios.get.mockResolvedValue(fakeResponse);

    const ticket = await api.getTicket('5');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${baseUrl}/tickets/5.json`,
      { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
    );
    expect(ticket).toEqual(fakeTicket);
  });

  it('listTickets should propagate errors thrown by axios', async () => {
    mockedAxios.get.mockRejectedValue(new Error('fail'));
    await expect(api.listTickets()).rejects.toThrow('fail');
  });
});
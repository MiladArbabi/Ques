// backend/adapters/reamaze/index.test.ts

// 1) Set env before importing anything
process.env.REAMAZE_API_URL = 'https://reamaze.test';
process.env.REAMAZE_API_KEY = 'key123';

import axios from 'axios';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// 2) Mock axios once
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// 3) Now import your adapter
import {
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  listTickets,
  getTicketComments,
  addTicketComment,
  updateTicketComment,
  deleteTicketComment,
} from './index';

const HEADERS = {
  Authorization: `Bearer key123`,
  'Content-Type': 'application/json',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Re:amaze Adapter (happy paths)', () => {
  it('getTicket calls GET and returns data', async () => {
    const fake = { id: '1', subject: 'Foo' };
    mockedAxios.get.mockResolvedValueOnce({ data: fake });

    const out = await getTicket('1');
    expect(out).toEqual(fake);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://reamaze.test/tickets/1',
      { headers: HEADERS }
    );
  });

  it('createTicket posts correctly', async () => {
    const payload = { subject: 'New' };
    const resp = { id: '2', ...payload };
    mockedAxios.post.mockResolvedValueOnce({ data: resp });

    const out = await createTicket(payload);
    expect(out).toEqual(resp);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://reamaze.test/tickets',
      payload,
      { headers: HEADERS }
    );
  });

  it('updateTicket puts correctly', async () => {
    const payload = { status: 'open' };
    const resp = { id: '3', ...payload };
    mockedAxios.put.mockResolvedValueOnce({ data: resp });

    const out = await updateTicket('3', payload);
    expect(out).toEqual(resp);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://reamaze.test/tickets/3',
      payload,
      { headers: HEADERS }
    );
  });

  it('deleteTicket calls DELETE and returns data', async () => {
    const resp = { success: true };
    mockedAxios.delete.mockResolvedValueOnce({ data: resp });

    const out = await deleteTicket('4');
    expect(out).toEqual(resp);
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      'https://reamaze.test/tickets/4',
      { headers: HEADERS }
    );
  });

  it('listTickets GETs with params and returns data', async () => {
    const resp = [{ id: 'a' }, { id: 'b' }];
    mockedAxios.get.mockResolvedValueOnce({ data: resp });

    const out1 = await listTickets();
    expect(out1).toEqual(resp);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://reamaze.test/tickets',
      { headers: HEADERS, params: {} }
    );

    mockedAxios.get.mockResolvedValueOnce({ data: resp });
    const query = { status: 'pending' };
    const out2 = await listTickets(query);
    expect(out2).toEqual(resp);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://reamaze.test/tickets',
      { headers: HEADERS, params: query }
    );
  });

  it('getTicketComments GETs comments', async () => {
    const comments = [{ id: 'c1' }];
    mockedAxios.get.mockResolvedValueOnce({ data: comments });

    const out = await getTicketComments('1');
    expect(out).toEqual(comments);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://reamaze.test/tickets/1/comments',
      { headers: HEADERS }
    );
  });

  it('addTicketComment posts comment data', async () => {
    const comment = { body: 'hi' };
    mockedAxios.post.mockResolvedValueOnce({ data: comment });

    const out = await addTicketComment('1', comment);
    expect(out).toEqual(comment);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://reamaze.test/tickets/1/comments',
      comment,
      { headers: HEADERS }
    );
  });

  it('updateTicketComment puts comment data', async () => {
    const comment = { body: 'updated' };
    mockedAxios.put.mockResolvedValueOnce({ data: comment });

    const out = await updateTicketComment('1', 'c1', comment);
    expect(out).toEqual(comment);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://reamaze.test/tickets/1/comments/c1',
      comment,
      { headers: HEADERS }
    );
  });

  it('deleteTicketComment calls DELETE and returns data', async () => {
    const resp = { ok: true };
    mockedAxios.delete.mockResolvedValueOnce({ data: resp });

    const out = await deleteTicketComment('1', 'c1');
    expect(out).toEqual(resp);
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      'https://reamaze.test/tickets/1/comments/c1',
      { headers: HEADERS }
    );
  });
});

describe('Re:amaze Adapter (error paths)', () => {
  const boom = new Error('boom');

  it('getTicket error is thrown and logged', async () => {
    mockedAxios.get.mockRejectedValueOnce(boom);
    await expect(getTicket('1')).rejects.toThrow('boom');
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  it('createTicket error is thrown and logged', async () => {
    mockedAxios.post.mockRejectedValueOnce(boom);
    await expect(createTicket({})).rejects.toThrow('boom');
    expect(mockedAxios.post).toHaveBeenCalled();
  });

  it('updateTicket error is thrown and logged', async () => {
    mockedAxios.put.mockRejectedValueOnce(boom);
    await expect(updateTicket('1', {})).rejects.toThrow('boom');
    expect(mockedAxios.put).toHaveBeenCalled();
  });

  it('deleteTicket error is thrown and logged', async () => {
    mockedAxios.delete.mockRejectedValueOnce(boom);
    await expect(deleteTicket('1')).rejects.toThrow('boom');
    expect(mockedAxios.delete).toHaveBeenCalled();
  });

  it('listTickets error is thrown and logged', async () => {
    mockedAxios.get.mockRejectedValueOnce(boom);
    await expect(listTickets()).rejects.toThrow('boom');
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  it('getTicketComments error is thrown and logged', async () => {
    mockedAxios.get.mockRejectedValueOnce(boom);
    await expect(getTicketComments('1')).rejects.toThrow('boom');
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  it('addTicketComment error is thrown and logged', async () => {
    mockedAxios.post.mockRejectedValueOnce(boom);
    await expect(addTicketComment('1', {})).rejects.toThrow('boom');
    expect(mockedAxios.post).toHaveBeenCalled();
  });

  it('updateTicketComment error is thrown and logged', async () => {
    mockedAxios.put.mockRejectedValueOnce(boom);
    await expect(updateTicketComment('1','c1', {})).rejects.toThrow('boom');
    expect(mockedAxios.put).toHaveBeenCalled();
  });

  it('deleteTicketComment error is thrown and logged', async () => {
    mockedAxios.delete.mockRejectedValueOnce(boom);
    await expect(deleteTicketComment('1','c1')).rejects.toThrow('boom');
    expect(mockedAxios.delete).toHaveBeenCalled();
  });
});

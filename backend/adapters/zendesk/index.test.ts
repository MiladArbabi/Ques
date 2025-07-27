// backend/adapters/zendesk/index.test.ts

// 1) Set env **before** importing anything
process.env.ZENDESK_API_URL   = 'https://zendesk.test';
process.env.ZENDESK_EMAIL     = 'user@example.com';
process.env.ZENDESK_API_TOKEN = 'token123';

import axios from 'axios';
import { jest, describe, it, beforeEach, expect } from '@jest/globals';

// 2) Mock axios once
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// 3) Now import your adapter (reads process.env and uses mocked axios)
import {
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  listTickets,
  searchTickets,
  getTicketComments,
  addTicketComment,
  updateTicketComment,
  deleteTicketComment,
} from './index';

beforeEach(() => {
  jest.clearAllMocks();
  // silence console.error in tests:
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('Zendesk Adapter', () => {

  it('getTicket calls GET with correct URL and auth', async () => {
    const ticket = { id: '1', subject: 'Test' };
    mockedAxios.get.mockResolvedValueOnce({ data: { ticket } });

    const result = await getTicket('1');
    expect(result).toEqual(ticket);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://zendesk.test/tickets/1.json',
      expect.objectContaining({
        auth: { username: 'user@example.com/token', password: 'token123' }
      })
    );
  });

  it('createTicket posts ticket data correctly', async () => {
    const payload = { subject: 'New' };
    mockedAxios.post.mockResolvedValueOnce({ data: { ticket: payload } });

    const result = await createTicket(payload);
    expect(result).toEqual(payload);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://zendesk.test/tickets.json',
      { ticket: payload },
      expect.objectContaining({
        auth: { username: 'user@example.com/token', password: 'token123' }
      })
    );
  });

  it('updateTicket puts ticket data correctly', async () => {
    const payload = { status: 'open' };
    mockedAxios.put.mockResolvedValueOnce({ data: { ticket: payload } });

    const result = await updateTicket('2', payload);
    expect(result).toEqual(payload);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://zendesk.test/tickets/2.json',
      { ticket: payload },
      expect.objectContaining({
        auth: { username: 'user@example.com/token', password: 'token123' }
      })
    );
  });

  it('deleteTicket calls DELETE and returns success flag', async () => {
    mockedAxios.delete.mockResolvedValueOnce({});
    const out = await deleteTicket('3');
    expect(out).toEqual({ success: true });
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      'https://zendesk.test/tickets/3.json',
      expect.objectContaining({
        auth: { username: 'user@example.com/token', password: 'token123' }
      })
    );
  });

  it('listTickets retrieves ticket list', async () => {
    const list = [{ id: '1' }, { id: '2' }];
    mockedAxios.get.mockResolvedValueOnce({ data: { tickets: list } });

    const result = await listTickets();
    expect(result).toEqual(list);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://zendesk.test/tickets.json',
      expect.objectContaining({
        auth: { username: 'user@example.com/token', password: 'token123' }
      })
    );
  });

  it('searchTickets encodes query and uses params/auth', async () => {
    const results = [{ id: 'a' }];
    mockedAxios.get.mockResolvedValueOnce({ data: { results } });

    const out = await searchTickets('foo bar');
    expect(out).toEqual(results);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://zendesk.test/search.json',
      expect.objectContaining({
        params: { query: 'foo bar' },
        auth:   { username: 'user@example.com/token', password: 'token123' }
      })
    );
  });

  it('getTicketComments retrieves comments', async () => {
    const comments = [{ id: 'c' }];
    mockedAxios.get.mockResolvedValueOnce({ data: { comments } });

    const out = await getTicketComments('1');
    expect(out).toEqual(comments);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://zendesk.test/tickets/1/comments.json',
      expect.objectContaining({
        auth: { username: 'user@example.com/token', password: 'token123' }
      })
    );
  });

  it('addTicketComment posts comment data correctly', async () => {
    const comment = { body: 'hello' };
    mockedAxios.post.mockResolvedValueOnce({ data: { comment } });

    const out = await addTicketComment('1', comment);
    expect(out).toEqual(comment);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://zendesk.test/tickets/1/comments.json',
      { comment },
      expect.objectContaining({
        auth: { username: 'user@example.com/token', password: 'token123' }
      })
    );
  });

  it('updateTicketComment puts comment data correctly', async () => {
    const updated = { body: 'updated' };
    mockedAxios.put.mockResolvedValueOnce({ data: { comment: updated } });

    const out = await updateTicketComment('1', 'c1', updated);
    expect(out).toEqual(updated);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://zendesk.test/tickets/1/comments/c1.json',
      { comment: updated },
      expect.objectContaining({
        auth: { username: 'user@example.com/token', password: 'token123' }
      })
    );
  });

  it('deleteTicketComment calls DELETE and returns success flag', async () => {
    mockedAxios.delete.mockResolvedValueOnce({});
    const out = await deleteTicketComment('1', 'c1');
    expect(out).toEqual({ success: true });
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      'https://zendesk.test/tickets/1/comments/c1.json',
      expect.objectContaining({
        auth: { username: 'user@example.com/token', password: 'token123' }
      })
    );
  });

  // Cover all the catch‐blocks for code coverage:
  it('getTicket throws if axios.get rejects', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
    await expect(getTicket('1')).rejects.toThrow('Network error');
  });

  it('createTicket throws if axios.post rejects', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Fail'));
    await expect(createTicket({})).rejects.toThrow('Fail');
  });

  it('updateTicket throws if axios.put rejects', async () => {
    mockedAxios.put.mockRejectedValueOnce(new Error('Fail'));
    await expect(updateTicket('1', {})).rejects.toThrow('Fail');
  });

  it('deleteTicket throws if axios.delete rejects', async () => {
    mockedAxios.delete.mockRejectedValueOnce(new Error('Fail'));
    await expect(deleteTicket('1')).rejects.toThrow('Fail');
  });

  it('listTickets throws if axios.get rejects', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Fail'));
    await expect(listTickets()).rejects.toThrow('Fail');
  });

  it('searchTickets throws if axios.get rejects', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Fail'));
    await expect(searchTickets('q')).rejects.toThrow('Fail');
  });

  it('getTicketComments throws if axios.get rejects', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Fail'));
    await expect(getTicketComments('1')).rejects.toThrow('Fail');
  });

  it('addTicketComment throws if axios.post rejects', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Fail'));
    await expect(addTicketComment('1', {})).rejects.toThrow('Fail');
  });

  it('updateTicketComment throws if axios.put rejects', async () => {
    mockedAxios.put.mockRejectedValueOnce(new Error('Fail'));
    await expect(updateTicketComment('1', 'c1', {})).rejects.toThrow('Fail');
  });

  it('deleteTicketComment throws if axios.delete rejects', async () => {
    mockedAxios.delete.mockRejectedValueOnce(new Error('Fail'));
    await expect(deleteTicketComment('1', 'c1')).rejects.toThrow('Fail');
  });
});

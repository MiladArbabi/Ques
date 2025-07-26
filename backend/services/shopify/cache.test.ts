import { getCached, setCached } from './cache';
import Redis from 'ioredis-mock';

jest.mock('ioredis', () => require('ioredis-mock'));

describe('Shopify Cache', () => {
  it('sets and gets data correctly', async () => {
    const key = 'test:key';
    const value = { foo: 'bar' };
    await setCached(key, value, 1);
    const result = await getCached(key);
    expect(result).toEqual(value);
  });
});

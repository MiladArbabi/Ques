// backend/services/shopify/cache.test.ts
import Redis from 'ioredis-mock';
import { getCached, setCached } from './cache';

// Make sure our Redis mock is used
jest.mock('ioredis', () => require('ioredis-mock'));

describe('Shopify Cache', () => {
  const key = 'test:key';
  const value = { foo: 'bar' };

  it('returns null when nothing is cached', async () => {
    // no setCached called yet
    const result = await getCached(key);
    expect(result).toBeNull();
  });

  it('sets and gets data correctly with default TTL', async () => {
    await setCached(key, value);
    const result = await getCached(key);
    expect(result).toEqual(value);
  });

  it('honors custom TTL', async () => {
    // set with very short TTL
    await setCached(key, value, 1);
    const result1 = await getCached(key);
    expect(result1).toEqual(value);

    // simulate wait > TTL
    await new Promise((r) => setTimeout(r, 1100));
    const result2 = await getCached(key);
    expect(result2).toBeNull();
  });
});

// backend/services/shopify/cache.integration.test.ts
import Redis from 'ioredis';
import axios from 'axios';
import { getOrder } from '../../services/shopify';
import { redisClient } from '../../services/shopify/cache';
process.env.SHOPIFY_STORE_URL    = process.env.SHOPIFY_STORE_URL    || 'https://shop.test';
process.env.SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || 'dummy-token';

// Ensure we use real Redis for integration testing
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Shopify Cache Integration', () => {
  const orderId = 'integration-123';
  const orderData = { id: orderId, total: 42 };
  const cacheKey = `shopify:order:${orderId}`;

  beforeAll(async () => {
    // Flush all keys before running tests
    await redis.flushdb();
  });

  afterAll(async () => {
    await redis.quit();
    await redisClient.quit();
  });

  it('caches order after first fetch and reuses it', async () => {
    // Stub HTTP response
    mockedAxios.get.mockResolvedValue({ data: { order: orderData } });

    // First fetch: should hit HTTP
    const first = await getOrder(orderId);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(first).toEqual(orderData);

    // Verify data is stored in Redis
    const raw = await redis.get(cacheKey);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!)).toEqual(orderData);

    // Reset mock
    mockedAxios.get.mockClear();

    // Second fetch: should come from cache, no HTTP call
    const second = await getOrder(orderId);
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(second).toEqual(orderData);
  });
});

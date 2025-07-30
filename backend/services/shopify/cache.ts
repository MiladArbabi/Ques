// backend/services/shopify/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export async function getCached(key: string) {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function setCached(key: string, value: any, ttl = 60) {
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
}

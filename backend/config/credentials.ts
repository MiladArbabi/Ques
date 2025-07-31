// backend/config/credentials.ts
export const getConfig = () => ({
  reamazeApiKey: process.env.REAMAZE_API_KEY!,
  zendeskApiToken: process.env.ZENDESK_API_TOKEN!,
  shopifyAccessToken: process.env.SHOPIFY_ACCESS_TOKEN!,
  mongoUri: process.env.MONGO_URI!,
  redisUrl: process.env.REDIS_URL!
});

import axios from 'axios';
import { getCached, setCached } from './cache';

const SHOPIFY_URL = process.env.SHOPIFY_STORE_URL!;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!;

export async function getOrder(orderId: string) {
  const cacheKey = \`shopify:order:\${orderId}\`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const resp = await axios.get(
    \`\${SHOPIFY_URL}/admin/api/2025-07/orders/\${orderId}.json\`,
    { headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN } }
  );
  const order = resp.data.order;
  await setCached(cacheKey, order, 300); // cache 5 min
  return order;
}

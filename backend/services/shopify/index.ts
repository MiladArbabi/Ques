// backend/services/shopify/index.ts
import axios from 'axios';
import { getCached, setCached } from './cache';

const SHOPIFY_URL = process.env.SHOPIFY_STORE_URL!;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!;
const API_VERSION = '2024-10'; 

export async function getOrder(orderId: string) {
  const cacheKey = `shopify:order:${orderId}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached;

  const url = `${SHOPIFY_URL}/admin/api/${API_VERSION}/orders/${orderId}.json`;
  console.log('[Shopify] GET', url);
  const resp = await axios.get(url, {
    headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN }
  });
  const draft = resp.data.draft_order;
  await setCached(cacheKey, draft, 300);
  return draft;
}

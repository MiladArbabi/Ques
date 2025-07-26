import axios from 'axios';

const SHOPIFY_URL = process.env.SHOPIFY_STORE_URL!;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!;

export async function getOrder(orderId: string) {
  const resp = await axios.get(
    \`\${SHOPIFY_URL}/admin/api/2025-07/orders/\${orderId}.json\`,
    {
      headers: { 'X-Shopify-Access-Token': ACCESS_TOKEN }
    }
  );
  return resp.data.order;
}

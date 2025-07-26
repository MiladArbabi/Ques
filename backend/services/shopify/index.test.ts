import axios from 'axios';
import { getOrder } from './index';

jest.mock('axios');
const mocked = axios as jest.Mocked<typeof axios>;

describe('Shopify Service', () => {
  it('fetches order by ID', async () => {
    mocked.get.mockResolvedValue({ data: { order: { id: '987' } } });
    const order = await getOrder('987');
    expect(axios.get).toHaveBeenCalledWith(
      \`\${process.env.SHOPIFY_STORE_URL}/admin/api/2025-07/orders/987.json\`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
        })
      })
    );
    expect(order).toEqual({ id: '987' });
  });
});

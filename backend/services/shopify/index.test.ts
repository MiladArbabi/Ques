process.env.SHOPIFY_STORE_URL   = 'https://shop.test';
process.env.SHOPIFY_ACCESS_TOKEN = 'sh-token';
jest.mock('axios');
jest.mock('./cache', () => ({
  getCached: jest.fn().mockResolvedValue(null),
  setCached: jest.fn().mockResolvedValue(undefined),
}));
import axios from 'axios';
import { getOrder } from './index';
const mocked = axios as jest.Mocked<typeof axios>;
import * as cache from './cache';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Shopify Service', () => {
  const stub = { id: '123', total: 9.99 };
  it('fetches order by ID', async () => {
    mocked.get.mockResolvedValue({ data: { order: { id: '987' } } });
    const order = await getOrder('987');
    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.SHOPIFY_STORE_URL}/admin/api/2025-07/orders/987.json`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
        })
      }) 
    );
    expect(order).toEqual({ id: '987' });
    expect(cache.setCached).toHaveBeenCalledWith(
      'shopify:order:987',
      { id: '987' },
      300
    );
  });

    it('returns cached order without hitting HTTP', async () => {
    const getCachedMock = cache.getCached as jest.MockedFunction<typeof cache.getCached>;
    getCachedMock.mockResolvedValueOnce(stub);

    const result = await getOrder('123');
    expect(result).toBe(stub);
    expect(axios.get).not.toHaveBeenCalled();
  });
});


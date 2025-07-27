// backend/services/shopify/index.test.ts

// 1) Set up env before importing anything
process.env.SHOPIFY_STORE_URL    = "https://shop.test";
process.env.SHOPIFY_ACCESS_TOKEN = "my-token";

import axios from 'axios';
import * as cache from './cache';
import {
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  listOrders,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from './index';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  jest.clearAllMocks();
  // default: cache miss
  jest.spyOn(cache, 'getCached').mockResolvedValue(null);
  jest.spyOn(cache, 'setCached').mockResolvedValue();
});

describe('Shopify Service (happy paths)', () => {
  describe('getOrder', () => {
    it('returns cached order if present', async () => {
      const fake = { id: 'cached' };
      jest
      .spyOn(cache, 'getCached')
      .mockResolvedValue(fake);

      const out = await getOrder('123');
      expect(out).toEqual(fake);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('fetches & caches on cache‑miss', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { order: { id: '987' } } });

      const out = await getOrder('987');
      expect(out).toEqual({ id: '987' });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://shop.test/admin/api/2025-07/orders/987.json`,
        expect.objectContaining({
          headers: { 'X-Shopify-Access-Token': 'my-token' },
        })
      );
      expect(cache.setCached).toHaveBeenCalledWith(
        'shopify_order_987',
        { id: '987' },
        expect.any(Number)
      );
    });
  });

  it('createOrder posts correctly', async () => {
    const payload = { foo: 'bar' };
    mockedAxios.post.mockResolvedValueOnce({ data: { order: payload } });

    const out = await createOrder(payload);
    expect(out).toEqual(payload);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `https://shop.test/admin/api/2023-10/orders.json`,
      { order: payload },
      expect.objectContaining({
        headers: { 'X-Shopify-Access-Token': 'my-token' },
      })
    );
  });

  it('updateOrder puts correctly', async () => {
    const payload = { shipped: true };
    mockedAxios.put.mockResolvedValueOnce({ data: { order: payload } });

    const out = await updateOrder('456', payload);
    expect(out).toEqual(payload);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      `https://shop.test/admin/api/2023-10/orders/456.json`,
      { order: payload },
      expect.objectContaining({
        headers: { 'X-Shopify-Access-Token': 'my-token' },
      })
    );
  });

  it('deleteOrder deletes and returns success flag', async () => {
    mockedAxios.delete.mockResolvedValueOnce({});
    const out = await deleteOrder('789');
    expect(out).toEqual({ success: true });
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      `https://shop.test/admin/api/2023-10/orders/789.json`,
      expect.objectContaining({
        headers: { 'X-Shopify-Access-Token': 'my-token' },
      })
    );
  });

  it('listOrders retrieves array', async () => {
    const list = [{ id: '1' }, { id: '2' }];
    mockedAxios.get.mockResolvedValueOnce({ data: { orders: list } });

    const out = await listOrders();
    expect(out).toEqual(list);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://shop.test/admin/api/2023-10/orders.json`,
      expect.objectContaining({
        headers: { 'X-Shopify-Access-Token': 'my-token' },
      })
    );
  });

  describe('Products', () => {
    it('returns cached product if present', async () => {
      const fake = { id: 'p1' };
      jest
      .spyOn(cache, 'getCached')
      .mockResolvedValue(fake);

      const out = await getProduct('p1');
      expect(out).toEqual(fake);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('fetches & caches product on miss', async () => {
      const prod = { id: 'p2' };
      mockedAxios.get.mockResolvedValueOnce({ data: { product: prod } });

      const out = await getProduct('p2');
      expect(out).toEqual(prod);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://shop.test/admin/api/2023-10/products/p2.json`,
        expect.objectContaining({
          headers: { 'X-Shopify-Access-Token': 'my-token' },
        })
      );
      expect(cache.setCached).toHaveBeenCalledWith(
        'shopify_product_p2',
        prod,
        expect.any(Number)
      );
    });

    it('createProduct posts correctly', async () => {
      const data = { name: 'X' };
      mockedAxios.post.mockResolvedValueOnce({ data: { product: data } });

      const out = await createProduct(data);
      expect(out).toEqual(data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `https://shop.test/admin/api/2023-10/products.json`,
        { product: data },
        expect.objectContaining({
          headers: { 'X-Shopify-Access-Token': 'my-token' },
        })
      );
    });

    it('updateProduct puts correctly', async () => {
      const data = { title: 'Y' };
      mockedAxios.put.mockResolvedValueOnce({ data: { product: data } });

      const out = await updateProduct('p3', data);
      expect(out).toEqual(data);
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `https://shop.test/admin/api/2023-10/products/p3.json`,
        { product: data },
        expect.objectContaining({
          headers: { 'X-Shopify-Access-Token': 'my-token' },
        })
      );
    });

    it('deleteProduct deletes and returns success', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});
      const out = await deleteProduct('p4');
      expect(out).toEqual({ success: true });
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `https://shop.test/admin/api/2023-10/products/p4.json`,
        expect.objectContaining({
          headers: { 'X-Shopify-Access-Token': 'my-token' },
        })
      );
    });
  });
});

describe('Shopify Service (error paths)', () => {
  const boom = new Error('boom');

  it('getOrder logs and rethrows when HTTP fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(boom);
    await expect(getOrder('999')).rejects.toThrow('boom');
  });

  it('createOrder rethrows on failure', async () => {
    mockedAxios.post.mockRejectedValueOnce(boom);
    await expect(createOrder({})).rejects.toThrow('boom');
  });

  it('updateOrder rethrows on failure', async () => {
    mockedAxios.put.mockRejectedValueOnce(boom);
    await expect(updateOrder('1', {})).rejects.toThrow('boom');
  });

  it('deleteOrder logs and rethrows on failure', async () => {
    mockedAxios.delete.mockRejectedValueOnce(boom);
    await expect(deleteOrder('1')).rejects.toThrow('boom');
  });

  it('listOrders logs and rethrows on failure', async () => {
    mockedAxios.get.mockRejectedValueOnce(boom);
    await expect(listOrders()).rejects.toThrow('boom');
  });

  it('getProduct rethrows HTTP errors', async () => {
    mockedAxios.get.mockRejectedValueOnce(boom);
    await expect(getProduct('1')).rejects.toThrow('boom');
  });

  it('createProduct rethrows on failure', async () => {
    mockedAxios.post.mockRejectedValueOnce(boom);
    await expect(createProduct({})).rejects.toThrow('boom');
  });

  it('updateProduct rethrows on failure', async () => {
    mockedAxios.put.mockRejectedValueOnce(boom);
    await expect(updateProduct('1', {})).rejects.toThrow('boom');
  });

  it('deleteProduct logs and rethrows on failure', async () => {
    mockedAxios.delete.mockRejectedValueOnce(boom);
    await expect(deleteProduct('1')).rejects.toThrow('boom');
  });

  it('getOrder continues on cache‑fetch error then fetches', async () => {
    // simulate getCached throwing
    jest.spyOn(cache, 'getCached').mockRejectedValueOnce(new Error('cache down'));
    mockedAxios.get.mockResolvedValueOnce({ data: { order: { id: '42' } } });

    const out = await getOrder('42');
    expect(out).toEqual({ id: '42' });
    expect(mockedAxios.get).toHaveBeenCalled();
  });
});

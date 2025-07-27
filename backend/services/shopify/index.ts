// backend/services/shopify/index.ts
process.env.SHOPIFY_STORE_URL    = "https://shop.test";
process.env.SHOPIFY_ACCESS_TOKEN = "my-token";

import axios from 'axios';
import { getCached, setCached } from './cache';

const SHOPIFY_URL = process.env.SHOPIFY_STORE_URL!;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!;

export async function getOrder(orderId: string) {
  const cacheKey = `shopify_order_${orderId}`;
  let cachedOrder: any = null;
  try {
    cachedOrder = await getCached(cacheKey);
  } catch (error) {
    console.error('Error fetching cached order:', error);
  }
  if (cachedOrder) {
    return cachedOrder;
  }

  try {
    const response = await axios.get(
      `${SHOPIFY_URL}/admin/api/2025-07/orders/${orderId}.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
        },
      }
    );
    const order = response.data.order;
    
    await setCached(cacheKey, order, 60 * 60); // Cache for 1 hour
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}
  
export async function createOrder(orderData: any) {
  try {
    const response = await axios.post(`${SHOPIFY_URL}/admin/api/2023-10/orders.json`, 
      { order: orderData }, 
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
        },
      }
    );
    return response.data.order;
  } catch (error) {
    throw error;
  }
}

export async function updateOrder(orderId: string, orderData: any) {
  try {
    const response = await axios.put(`${SHOPIFY_URL}/admin/api/2023-10/orders/${orderId}.json`, 
      { order: orderData }, 
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
        },
      }
    );
    return response.data.order;
  } catch (error) {
    throw error;
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await axios.delete(`${SHOPIFY_URL}/admin/api/2023-10/orders/${orderId}.json`, {
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

export async function listOrders() {
  try {
    const response = await axios.get(`${SHOPIFY_URL}/admin/api/2023-10/orders.json`, {
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
      },
    });
    return response.data.orders;
  } catch (error) {
    console.error('Error listing orders:', error);
    throw error;
  }
}

export async function getProduct(productId: string) {
  const cacheKey = `shopify_product_${productId}`;
  const cachedProduct = await getCached(cacheKey);
  
  if (cachedProduct) {
    return cachedProduct;
  }

  try {
    const response = await axios.get(`${SHOPIFY_URL}/admin/api/2023-10/products/${productId}.json`, {
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
      },
    });
    const product = response.data.product;
    
    setCached(cacheKey, product, 60 * 60); // Cache for 1 hour
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function createProduct(productData: any) {
  try {
    const response = await axios.post(`${SHOPIFY_URL}/admin/api/2023-10/products.json`, 
      { product: productData },
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
        },
      }
    );
    return response.data.product;
  } catch (error) {
    throw error;
  }
}

export async function updateProduct(productId: string, productData: any) {
  try {
    const response = await axios.put(`${SHOPIFY_URL}/admin/api/2023-10/products/${productId}.json`, 
      { product: productData },
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
        },
      }
    );
    return response.data.product;
  } catch (error) {
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    await axios.delete(`${SHOPIFY_URL}/admin/api/2023-10/products/${productId}.json`, {
      headers: {
        'X-Shopify-Access-Token': ACCESS_TOKEN,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}
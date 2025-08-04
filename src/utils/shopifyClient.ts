import axios from 'axios';

export const shopify = axios.create({
  baseURL: `https://${process.env.SHOPIFY_STORE}/admin/api/2023-10`,
  headers: {
    'X-Shopify-Access-Token': process.env.SHOPIFY_API_TOKEN,
    'Content-Type': 'application/json',
  },
});

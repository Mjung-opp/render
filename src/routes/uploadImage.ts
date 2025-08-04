import express from 'express';
import { shopify } from '../utils/shopifyClient';

const router = express.Router();

router.post('/upload-image', async (req, res) => {
  try {
    const { file_name, image_url } = req.body;
    if (!file_name || !image_url) {
      return res.status(400).json({ error: 'Missing file_name or image_url' });
    }

    // Expected filename pattern: "product-title - skyline - ... - black - ... - no.jpg"
    const match = file_name.toLowerCase().match(/^(.*?)\s*-\s*skyline.*black.*no/);
    if (!match) {
      return res.status(400).json({ error: 'Filename does not match expected pattern' });
    }

    const handle = match[1].trim().toLowerCase().replace(/\s+/g, '-');

    // Fetch product by handle
    const productResponse = await shopify.get(`/products.json?handle=${handle}`);
    const product = productResponse.data.products?.[0];

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const variant = product.variants.find(
      (v: any) => v.option1 && v.option1.toLowerCase() === 'black'
    );

    if (!variant) {
      return res.status(404).json({ error: 'Matching variant not found' });
    }

    // Assign image to variant
    await shopify.post(`/products/${product.id}/images.json`, {
      image: {
        src: image_url,
        variant_ids: [variant.id]
      }
    });

    return res.json({ success: true, product_id: product.id, variant_id: variant.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

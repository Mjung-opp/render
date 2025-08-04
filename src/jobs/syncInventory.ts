import cron from 'node-cron';
import { shopify } from '../utils/shopifyClient';
import { qb, updateItemQuantity } from '../utils/quickbooksClient';

async function fetchShopifyMaterials() {
  const products: any[] = [];
  let pageInfo: string | undefined;

  do {
    const url = pageInfo
      ? `/products.json?limit=250&page_info=${pageInfo}`
      : `/products.json?limit=250&fields=id,title,variants,tags,product_type`;

    const res = await shopify.get(url);
    res.data.products.forEach((p: any) => {
      if (
        p.tags?.includes('material') ||
        p.product_type?.toLowerCase() === 'materials'
      ) {
        products.push(p);
      }
    });

    pageInfo = res.headers['link']?.match(/page_info=([^&>]+)&/i)?.[1];
  } while (pageInfo);

  return products;
}

async function syncOnce() {
  console.log('[Inventory Sync] Starting sync from Shopify → QuickBooks');
  const materials = await fetchShopifyMaterials();

  for (const product of materials) {
    for (const variant of product.variants) {
      const sku = variant.sku;
      const qty = variant.inventory_quantity;
      if (!sku) continue;

      try {
        const query = `select * from Item where Sku='${sku}'`;
        const data = await qb.query(query);
        const item = data.QueryResponse.Item?.[0];
        if (!item) {
          console.warn(`[Inventory Sync] QB Item not found for SKU ${sku}`);
          continue;
        }

        if (item.QtyOnHand !== qty) {
          await updateItemQuantity(item.Id, qty);
          console.log(`[Inventory Sync] Updated SKU ${sku} → Qty ${qty}`);
        }
      } catch (err) {
        console.error(`[Inventory Sync] Error syncing SKU ${sku}`, err);
      }
    }
  }
  console.log('[Inventory Sync] Complete');
}

cron.schedule('0 14 * * *', syncOnce, {
  timezone: 'Etc/UTC',
});

export { syncOnce };

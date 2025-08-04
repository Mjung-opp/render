# render
# Shopify ↔ QuickBooks Inventory Agent

This agent keeps **QuickBooks Online** in sync with Shopify, treating **Shopify as the system of record** for material inventory.

## ✨ Features

1. **Daily Cron (18:00 Dubai / 14:00 UTC)** – Fetches Shopify material SKUs and updates their **QtyOnHand** in QuickBooks if different.
2. **Webhook** `/upload-image` – Handles Google Drive image assignments to the correct Shopify variant (unchanged).
3. Uses **node‑quickbooks** SDK and **Shopify Admin API**.

## 🗄 Project Structure

```text
src/
  jobs/
    syncInventory.ts      # Shopify → QuickBooks daily sync
  routes/
    uploadImage.ts        # Google Drive image webhook
  utils/
    shopifyClient.ts      # Axios wrapper for Shopify
    quickbooksClient.ts   # QuickBooks helper
  index.ts                # Express server & cron boot
script.gs                 # Google Apps Script trigger
.env.example              # Environment variables template
package.json              # Dependencies & scripts
```

## 🚀 Setup

```bash
npm install
cp .env.example .env   # fill credentials
npm run dev            # local run
```

### Deployment
Deploy to Render/Fly.io/Vercel. Ensure env vars are set and **persistent cron** is allowed.

## ⚙️ Cron Details
```
0 14 * * *   # Runs at 14:00 UTC which is 18:00 Asia/Dubai
```

## 🔄 How Sync Works
1. Pull all Shopify products tagged `material` or with `product_type = Materials`.
2. Loop through variants, compare `inventory_quantity` with QuickBooks `QtyOnHand`.
3. If different, perform **sparse Item update** in QuickBooks with new quantity.

---

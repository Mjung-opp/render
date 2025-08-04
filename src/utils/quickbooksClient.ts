import QuickBooks from 'node-quickbooks';
import dotenv from 'dotenv';

dotenv.config();

export const qb = new QuickBooks(
  process.env.QB_CLIENT_ID as string,
  process.env.QB_CLIENT_SECRET as string,
  process.env.QB_OAUTH_TOKEN as string,
  process.env.QB_OAUTH_SECRET as string,
  process.env.QB_REALM_ID as string,
  true, // sandbox
  true, // debug
  process.env.QB_MINOR_VERSION || '65',
  '2.0',
  process.env.QB_REFRESH_TOKEN as string
);

export async function updateItemQuantity(
  itemId: string,
  newQty: number
): Promise<void> {
  const existing = await qb.getItem(itemId);
  const sparseUpdate = {
    Id: existing?.Id,
    SyncToken: existing?.SyncToken,
    QtyOnHand: newQty,
    sparse: true,
  } as any;
  await qb.updateItem(sparseUpdate);
}

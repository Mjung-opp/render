from fastapi import FastAPI, Request
from functions import process_sync

app = FastAPI()

@app.post("/sync")
async def sync_inventory(request: Request):
    body = await request.json()
    run_date = body.get("run_date")
    result = process_sync(run_date)
    return {"status": "success", "details": result}

    import schedule
import time
from datetime import datetime
from functions import sync_quickbooks_bill_to_shopify

def run_daily():
    today = datetime.now().strftime("%Y-%m-%d")
    sync_quickbooks_bill_to_shopify(run_date=today)

schedule.every().day.at("14:00").do(run_daily)  # 6pm Dubai = 14:00 UTC

while True:
    schedule.run_pending()
    time.sleep(60)

run_daily()

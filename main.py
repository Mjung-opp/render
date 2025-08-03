import schedule
import time
import threading
import logging
from datetime import datetime
from fastapi import FastAPI
import uvicorn
from functions import sync_quickbooks_bill_to_shopify

# Set up basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()

def run_daily():
    today = datetime.now().strftime("%Y-%m-%d")
    try:
        logging.info("Running daily sync for date: %s", today)
        sync_quickbooks_bill_to_shopify(run_date=today)
        logging.info("Sync completed successfully.")
    except Exception as e:
        logging.error("Error during sync: %s", e)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/sync-now")
def manual_sync():
    try:
        run_daily()
        return {"message": "Sync completed"}
    except Exception as e:
        return {"error": str(e)}

def schedule_loop():
    schedule.every().day.at("14:00").do(run_daily)
    logging.info("Scheduler started. Waiting for daily trigger...")
    while True:
        schedule.run_pending()
        time.sleep(60)

# Manual sync on startup
run_daily()

# Start scheduler in a separate thread
threading.Thread(target=schedule_loop, daemon=True).start()

# Run FastAPI server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

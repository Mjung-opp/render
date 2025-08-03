from fastapi import FastAPI, Request
from functions import process_sync

app = FastAPI()

@app.post("/sync")
async def sync_inventory(request: Request):
    body = await request.json()
    run_date = body.get("run_date")
    result = process_sync(run_date)
    return {"status": "success", "details": result}

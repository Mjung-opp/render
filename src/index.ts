import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import uploadImageRouter from './routes/uploadImage';

// Start inventory sync cron job
import './jobs/syncInventory';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use('/', uploadImageRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Inventory Agent running on port ${PORT}`);
});

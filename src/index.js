import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const swaggerPath = path.join(__dirname, '..', 'docs', 'swagger.json');
let swaggerDoc = {};
try {
  const raw = fs.readFileSync(swaggerPath, 'utf-8');
  swaggerDoc = JSON.parse(raw);
} catch (err) {
  console.error(
    '⚠️ Swagger JSON not found. Did you run npm run build-docs?',
    err.message,
  );
}

app.get('/docs/swagger.json', (req, res) => {
  res.sendFile(swaggerPath);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const startApp = async () => {
  await initMongoConnection();
  setupServer(app);
};

startApp();

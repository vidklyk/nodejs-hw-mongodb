// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

import contactsRouter from './routes/contacts.routes.js';
import authRouter from './routes/auth.routes.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  const swaggerPath = path.join(process.cwd(), 'docs', 'swagger.json');

  app.get('/docs/swagger.json', (req, res) => {
    if (fs.existsSync(swaggerPath)) {
      return res.sendFile(swaggerPath);
    }
    return res.status(500).json({
      status: 500,
      message: 'Swagger JSON not found. Run `npm run build-docs`.',
      data: null,
    });
  });

  let swaggerDocument;
  try {
    swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
  } catch {
    swaggerDocument = {
      openapi: '3.1.0',
      info: { title: 'API Docs', version: '1.0.0' },
      paths: {},
    };
    console.warn(
      '⚠️  docs/swagger.json не знайдено. Запусти: npm run build-docs',
    );
  }
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

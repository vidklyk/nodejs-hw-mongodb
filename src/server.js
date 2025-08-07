import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser'; // <-- додати це
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
  app.use(cookieParser()); // <-- додати це

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

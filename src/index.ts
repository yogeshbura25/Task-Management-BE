import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

import errorMiddleware from './middlewares/error.middleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});
// Routes
app.use('/auth', authRoutes);

// Global Error Handler
app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;

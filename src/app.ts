import express, { Request, Response } from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import prodottiRouter from './routes/prodotti';
import ordiniRouter from './routes/ordini';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/prodotti', prodottiRouter);
app.use('/api/v1/ordini', ordiniRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('API Node.js/Express is working');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

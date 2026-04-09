import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { autenticaUtente } from '../utils/session';
import { ProdottiCreateSchema, ProdottiUpdateSchema } from '../schema/prodotti';

const router = Router();

router.get('/', autenticaUtente, async (req: Request, res: Response) => {
  const prodotti = await prisma.prodotto.findMany();
  return res.json(prodotti);
});

router.get('/:id', autenticaUtente, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const prodotto = await prisma.prodotto.findUnique({
    where: { id_prodotto: id },
    include: { categoria: true, allergeni: true }
  });

  if (!prodotto) return res.status(404).json({ detail: 'Prodotto non trovato' });
  return res.json(prodotto);
});

router.post('/', autenticaUtente, async (req: Request, res: Response) => {
  try {
    const utente = (req as any).utente;
    if (utente.type !== 'gestore') {
      return res.status(403).json({ detail: 'Solo i gestori possono creare prodotti' });
    }

    const data = ProdottiCreateSchema.parse(req.body);
    const nuovoProdotto = await prisma.prodotto.create({
      data: {
        ...data
      }
    });

    return res.json(nuovoProdotto);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.patch('/:id', autenticaUtente, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const utente = (req as any).utente;
    if (utente.type !== 'gestore') {
      return res.status(403).json({ detail: 'Solo i gestori possono aggiornare prodotti' });
    }

    const data = ProdottiUpdateSchema.parse(req.body);
    const prodotto = await prisma.prodotto.update({
      where: { id_prodotto: id },
      data: { ...data }
    });

    return res.json(prodotto);
  } catch (error) {
    // If not found or validation error
    return res.status(400).json(error);
  }
});

export default router;

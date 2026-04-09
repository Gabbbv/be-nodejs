import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { autenticaUtente } from '../utils/session';
import { OrdiniCreateSchema, OrdiniUpdateSchema } from '../schema/ordini';

const router = Router();

router.post('/', autenticaUtente, async (req: Request, res: Response) => {
  try {
    const utente = (req as any).utente;
    if (utente.type !== 'cliente') {
      return res.status(403).json({ detail: 'Solo i clienti possono creare ordini' });
    }

    const data = OrdiniCreateSchema.parse(req.body);
    const nuovoOrdine = await prisma.ordine.create({
      data: {
        ...data,
        id_cliente: utente.id_utente
      }
    });

    return res.json(nuovoOrdine);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.get('/', autenticaUtente, async (req: Request, res: Response) => {
  const utente = (req as any).utente;
  const ordini = await prisma.ordine.findMany({
    where: { id_cliente: utente.id_utente }
  });
  return res.json(ordini);
});

router.get('/:id', autenticaUtente, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const utente = (req as any).utente;

  const ordine = await prisma.ordine.findUnique({
    where: { id_ordine: id }
  });

  if (!ordine) return res.status(404).json({ detail: 'Ordine non trovato' });

  if (utente.type === 'cliente' && utente.id_utente !== ordine.id_cliente) {
    return res.status(403).json({ detail: 'Ordine non trovato (o accesso negato)' });
  }

  return res.json(ordine);
});

router.patch('/:id/stato', autenticaUtente, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const utente = (req as any).utente;

    if (utente.type !== 'gestore') {
      return res.status(403).json({ detail: "Non hai i permessi per aggiornare lo stato dell'ordine" });
    }

    const data = OrdiniUpdateSchema.parse(req.body);
    const ordine = await prisma.ordine.update({
      where: { id_ordine: id },
      data: { ...data }
    });

    return res.json(ordine);
  } catch (error) {
    return res.status(400).json(error);
  }
});

export default router;

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/db';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const generaToken = (userId: number): string => {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '1d' });
};

export const autenticaUtente = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const userId = payload.sub;

    const utente = await prisma.utente.findUnique({
      where: { id_utente: userId },
    });

    if (!utente) {
      return res.status(401).json({ detail: 'Utente non trovato' });
    }

    // Check if there's an active session in db
    const activeSession = await prisma.sessione.findUnique({
      where: { token },
    });

    if (!activeSession || !activeSession.is_active) {
      return res.status(401).json({ detail: 'Sessione scaduta o invalida' });
    }

    // Pass the user string to the req object
    (req as any).utente = utente;
    next();
  } catch (error) {
    return res.status(401).json({ detail: 'Token invalido o scaduto' });
  }
};

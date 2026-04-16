import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/db';

export const generaToken = (userId: number): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const autenticaUtente = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1] as string;
  try {
    const activeSession = await prisma.sessione.findFirst({
      where: { token },
      include: { 
        utente: {
          include: {
            gestore: true,
            cliente: true
          }
        } 
      }
    });

    if (!activeSession) {
      return res.status(401).json({ detail: 'Sessione non trovata o invalida' });
    }

    const utenteObj: any = activeSession.utente;
    if (utenteObj.gestore) utenteObj.type = 'gestore';
    else if (utenteObj.cliente) utenteObj.type = 'cliente';

    (req as any).utente = utenteObj;
    next();
  } catch (error) {
    return res.status(401).json({ detail: 'Token invalido o errore DB' });
  }
};

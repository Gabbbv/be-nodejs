import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/db';

export const generaToken = (userId: number): string => {
  // Genera un token hex randomico lungo esattamente 64 caratteri (32 bytes * 2) per adattarsi a VarChar(64) nativamente
  return crypto.randomBytes(32).toString('hex');
};

export const autenticaUtente = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Not authenticated' });
  }

  const token = authHeader.split(' ')[1] as string;
  try {
    // Cerchiamo direttamente il token univoco nel Database reale, includendo le dipendenze per scoprire se l'utente è Gestore o Cliente
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

    // Ricostruiamo la proprietà "type" in base alle relazioni trovate nel database
    const utenteObj: any = activeSession.utente;
    if (utenteObj.gestore) utenteObj.type = 'gestore';
    else if (utenteObj.cliente) utenteObj.type = 'cliente';

    // Pass the user object to the req object
    (req as any).utente = utenteObj;
    next();
  } catch (error) {
    return res.status(401).json({ detail: 'Token invalido o errore DB' });
  }
};

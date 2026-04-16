import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { autenticaUtente, generaToken } from '../utils/session';
import { getPasswordHash, verifyPassword } from '../utils/hashing';
import { UtenteLoginSchema, ClienteCreateSchema, ClienteUpdateSchema } from '../schema/auth';

const router = Router();

router.get('/', autenticaUtente, async (req: Request, res: Response) => {
  const utente = (req as any).utente;
  const { password, ...utentePublic } = utente;
  return res.json(utentePublic);
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = UtenteLoginSchema.parse(req.body);
    const utenteDb = await prisma.utente.findUnique({
      where: { email: data.email }
    });

    if (!utenteDb) return res.status(404).json({ detail: 'Utente non trovato' });

    const isValid = await verifyPassword(data.password, utenteDb.password);
    if (!isValid) return res.status(401).json({ detail: 'Password errata' });

    const token = generaToken(utenteDb.id_utente);
    const sessione = await prisma.sessione.create({
      data: {
        id_utente: utenteDb.id_utente,
        token: token,
        data_creazione: Math.floor(Date.now() / 1000)
      }
    });

    return res.json({ token, id_utente: sessione.id_utente });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const data = ClienteCreateSchema.parse(req.body);
    const hashedPassword = await getPasswordHash(data.password);

    const nuovoUtente = await prisma.utente.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        nome: data.nome,
        cognome: data.cognome,
        cliente: {
          create: {
            classe: data.classe
          }
        }
      },
      include: { cliente: true }
    });

    const { password, ...publicData } = nuovoUtente;
    return res.json(publicData);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.patch('/profilo', autenticaUtente, async (req: Request, res: Response) => {
  try {
    const data = ClienteUpdateSchema.parse(req.body);
    const authUtente = (req as any).utente;

    const clienteDaAggiornare = await prisma.utente.findUnique({
      where: { id_utente: authUtente.id_utente },
      include: { cliente: true }
    });

    if (!clienteDaAggiornare || !clienteDaAggiornare.cliente) {
      return res.status(404).json({ detail: 'Utente non trovato o non è un cliente' });
    }

    const updateData: any = {};
    if (data.username) updateData.username = data.username;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = await getPasswordHash(data.password);
    if (data.nome) updateData.nome = data.nome;
    if (data.cognome) updateData.cognome = data.cognome;

    let clienteUpdateData = undefined;
    if (data.classe) {
      clienteUpdateData = { update: { classe: data.classe } };
    }

    const aggiornato = await prisma.utente.update({
      where: { id_utente: authUtente.id_utente },
      data: {
        ...updateData,
        cliente: clienteUpdateData
      },
      include: { cliente: true }
    });

    const { password, ...publicData } = aggiornato;
    return res.json(publicData);
  } catch (error) {
    return res.status(400).json(error);
  }
});

export default router;

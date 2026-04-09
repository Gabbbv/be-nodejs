import { z } from 'zod';

export const UtenteLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const ClienteCreateSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  nome: z.string(),
  cognome: z.string(),
  classe: z.string().optional(),
});

export const ClienteUpdateSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  nome: z.string().optional(),
  cognome: z.string().optional(),
  classe: z.string().optional(),
});

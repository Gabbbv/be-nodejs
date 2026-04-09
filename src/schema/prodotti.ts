import { z } from 'zod';

export const ProdottiCreateSchema = z.object({
  nome: z.string(),
  descrizione: z.string().optional(),
  specifiche: z.string().optional(),
  prezzo: z.number(),
  sconto: z.number().default(0.0),
  quantita: z.number().default(0),
  immagine_url: z.string().optional(),
  is_bundle: z.boolean().default(false),
  id_categoria: z.number().optional()
});

export const ProdottiUpdateSchema = ProdottiCreateSchema.partial();

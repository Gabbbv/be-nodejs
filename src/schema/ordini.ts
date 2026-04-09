import { z } from 'zod';

export const OrdiniCreateSchema = z.object({
  timestamp_ordine: z.string().datetime(),
  stato: z.string().default("in_attesa"),
  pin_ritiro: z.string().optional(),
  note: z.string().optional(),
  orario_ritiro: z.string().datetime().optional()
});

export const OrdiniUpdateSchema = z.object({
  stato: z.string().optional(),
  note: z.string().optional(),
  orario_ritiro: z.string().datetime().optional(),
  pin_ritiro: z.string().optional()
});

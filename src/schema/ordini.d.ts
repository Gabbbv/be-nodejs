import { z } from 'zod';
export declare const OrdiniCreateSchema: z.ZodObject<{
    timestamp_ordine: z.ZodString;
    stato: z.ZodDefault<z.ZodString>;
    pin_ritiro: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
    orario_ritiro: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const OrdiniUpdateSchema: z.ZodObject<{
    stato: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
    orario_ritiro: z.ZodOptional<z.ZodString>;
    pin_ritiro: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=ordini.d.ts.map
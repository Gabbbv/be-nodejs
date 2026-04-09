import { z } from 'zod';
export declare const UtenteLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const ClienteCreateSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    nome: z.ZodString;
    cognome: z.ZodString;
    classe: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const ClienteUpdateSchema: z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    nome: z.ZodOptional<z.ZodString>;
    cognome: z.ZodOptional<z.ZodString>;
    classe: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=auth.d.ts.map
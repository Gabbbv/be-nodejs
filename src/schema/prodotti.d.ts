import { z } from 'zod';
export declare const ProdottiCreateSchema: z.ZodObject<{
    nome: z.ZodString;
    descrizione: z.ZodOptional<z.ZodString>;
    specifiche: z.ZodOptional<z.ZodString>;
    prezzo: z.ZodNumber;
    sconto: z.ZodDefault<z.ZodNumber>;
    quantita: z.ZodDefault<z.ZodNumber>;
    immagine_url: z.ZodOptional<z.ZodString>;
    is_bundle: z.ZodDefault<z.ZodBoolean>;
    id_categoria: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const ProdottiUpdateSchema: z.ZodObject<{
    nome: z.ZodOptional<z.ZodString>;
    descrizione: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    specifiche: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    prezzo: z.ZodOptional<z.ZodNumber>;
    sconto: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    quantita: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    immagine_url: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    is_bundle: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    id_categoria: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
//# sourceMappingURL=prodotti.d.ts.map
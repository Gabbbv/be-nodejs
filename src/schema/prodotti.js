"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdottiUpdateSchema = exports.ProdottiCreateSchema = void 0;
const zod_1 = require("zod");
exports.ProdottiCreateSchema = zod_1.z.object({
    nome: zod_1.z.string(),
    descrizione: zod_1.z.string().optional(),
    specifiche: zod_1.z.string().optional(),
    prezzo: zod_1.z.number(),
    sconto: zod_1.z.number().default(0.0),
    quantita: zod_1.z.number().default(0),
    immagine_url: zod_1.z.string().optional(),
    is_bundle: zod_1.z.boolean().default(false),
    id_categoria: zod_1.z.number().optional()
});
exports.ProdottiUpdateSchema = exports.ProdottiCreateSchema.partial();
//# sourceMappingURL=prodotti.js.map
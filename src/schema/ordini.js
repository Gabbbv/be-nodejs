"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdiniUpdateSchema = exports.OrdiniCreateSchema = void 0;
const zod_1 = require("zod");
exports.OrdiniCreateSchema = zod_1.z.object({
    timestamp_ordine: zod_1.z.string().datetime(),
    stato: zod_1.z.string().default("in_attesa"),
    pin_ritiro: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
    orario_ritiro: zod_1.z.string().datetime().optional()
});
exports.OrdiniUpdateSchema = zod_1.z.object({
    stato: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
    orario_ritiro: zod_1.z.string().datetime().optional(),
    pin_ritiro: zod_1.z.string().optional()
});
//# sourceMappingURL=ordini.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteUpdateSchema = exports.ClienteCreateSchema = exports.UtenteLoginSchema = void 0;
const zod_1 = require("zod");
exports.UtenteLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.ClienteCreateSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    nome: zod_1.z.string(),
    cognome: zod_1.z.string(),
    classe: zod_1.z.string().optional(),
});
exports.ClienteUpdateSchema = zod_1.z.object({
    username: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().optional(),
    nome: zod_1.z.string().optional(),
    cognome: zod_1.z.string().optional(),
    classe: zod_1.z.string().optional(),
});
//# sourceMappingURL=auth.js.map
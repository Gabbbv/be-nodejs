"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticaUtente = exports.generaToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = require("express");
const db_1 = require("../db/db");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const generaToken = (userId) => {
    return jsonwebtoken_1.default.sign({ sub: userId }, JWT_SECRET, { expiresIn: '1d' });
};
exports.generaToken = generaToken;
const autenticaUtente = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ detail: 'Not authenticated' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userId = payload.sub;
        const utente = await db_1.prisma.utente.findUnique({
            where: { id_utente: userId },
        });
        if (!utente) {
            return res.status(401).json({ detail: 'Utente non trovato' });
        }
        // Check if there's an active session in db
        const activeSession = await db_1.prisma.sessione.findUnique({
            where: { token },
        });
        if (!activeSession || !activeSession.is_active) {
            return res.status(401).json({ detail: 'Sessione scaduta o invalida' });
        }
        // Pass the user string to the req object
        req.utente = utente;
        next();
    }
    catch (error) {
        return res.status(401).json({ detail: 'Token invalido o scaduto' });
    }
};
exports.autenticaUtente = autenticaUtente;
//# sourceMappingURL=session.js.map
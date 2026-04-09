"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db/db");
const session_1 = require("../utils/session");
const ordini_1 = require("../schema/ordini");
const router = (0, express_1.Router)();
router.post('/', session_1.autenticaUtente, async (req, res) => {
    try {
        const utente = req.utente;
        if (utente.type !== 'cliente') {
            return res.status(403).json({ detail: 'Solo i clienti possono creare ordini' });
        }
        const data = ordini_1.OrdiniCreateSchema.parse(req.body);
        const nuovoOrdine = await db_1.prisma.ordine.create({
            data: {
                ...data,
                id_cliente: utente.id_utente
            }
        });
        return res.json(nuovoOrdine);
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
router.get('/', session_1.autenticaUtente, async (req, res) => {
    const utente = req.utente;
    const ordini = await db_1.prisma.ordine.findMany({
        where: { id_cliente: utente.id_utente }
    });
    return res.json(ordini);
});
router.get('/:id', session_1.autenticaUtente, async (req, res) => {
    const id = parseInt(req.params.id);
    const utente = req.utente;
    const ordine = await db_1.prisma.ordine.findUnique({
        where: { id_ordine: id }
    });
    if (!ordine)
        return res.status(404).json({ detail: 'Ordine non trovato' });
    if (utente.type === 'cliente' && utente.id_utente !== ordine.id_cliente) {
        return res.status(403).json({ detail: 'Ordine non trovato (o accesso negato)' });
    }
    return res.json(ordine);
});
router.patch('/:id/stato', session_1.autenticaUtente, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const utente = req.utente;
        if (utente.type !== 'gestore') {
            return res.status(403).json({ detail: "Non hai i permessi per aggiornare lo stato dell'ordine" });
        }
        const data = ordini_1.OrdiniUpdateSchema.parse(req.body);
        const ordine = await db_1.prisma.ordine.update({
            where: { id_ordine: id },
            data: { ...data }
        });
        return res.json(ordine);
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
exports.default = router;
//# sourceMappingURL=ordini.js.map
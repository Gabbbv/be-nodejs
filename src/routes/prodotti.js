"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db/db");
const session_1 = require("../utils/session");
const prodotti_1 = require("../schema/prodotti");
const router = (0, express_1.Router)();
router.get('/', session_1.autenticaUtente, async (req, res) => {
    const prodotti = await db_1.prisma.prodotto.findMany();
    return res.json(prodotti);
});
router.get('/:id', session_1.autenticaUtente, async (req, res) => {
    const id = parseInt(req.params.id);
    const prodotto = await db_1.prisma.prodotto.findUnique({
        where: { id_prodotto: id },
        include: { categoria: true, allergeni: true }
    });
    if (!prodotto)
        return res.status(404).json({ detail: 'Prodotto non trovato' });
    return res.json(prodotto);
});
router.post('/', session_1.autenticaUtente, async (req, res) => {
    try {
        const utente = req.utente;
        if (utente.type !== 'gestore') {
            return res.status(403).json({ detail: 'Solo i gestori possono creare prodotti' });
        }
        const data = prodotti_1.ProdottiCreateSchema.parse(req.body);
        const nuovoProdotto = await db_1.prisma.prodotto.create({
            data: {
                ...data
            }
        });
        return res.json(nuovoProdotto);
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
router.patch('/:id', session_1.autenticaUtente, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const utente = req.utente;
        if (utente.type !== 'gestore') {
            return res.status(403).json({ detail: 'Solo i gestori possono aggiornare prodotti' });
        }
        const data = prodotti_1.ProdottiUpdateSchema.parse(req.body);
        const prodotto = await db_1.prisma.prodotto.update({
            where: { id_prodotto: id },
            data: { ...data }
        });
        return res.json(prodotto);
    }
    catch (error) {
        // If not found or validation error
        return res.status(400).json(error);
    }
});
exports.default = router;
//# sourceMappingURL=prodotti.js.map
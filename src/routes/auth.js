"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db/db");
const session_1 = require("../utils/session");
const hashing_1 = require("../utils/hashing");
const auth_1 = require("../schema/auth");
const router = (0, express_1.Router)();
router.get('/', session_1.autenticaUtente, async (req, res) => {
    const utente = req.utente;
    const { password, ...utentePublic } = utente;
    return res.json(utentePublic);
});
router.post('/login', async (req, res) => {
    try {
        const data = auth_1.UtenteLoginSchema.parse(req.body);
        const utenteDb = await db_1.prisma.utente.findUnique({
            where: { email: data.email }
        });
        if (!utenteDb)
            return res.status(404).json({ detail: 'Utente non trovato' });
        const isValid = await (0, hashing_1.verifyPassword)(data.password, utenteDb.password);
        if (!isValid)
            return res.status(401).json({ detail: 'Password errata' });
        const token = (0, session_1.generaToken)(utenteDb.id_utente);
        const sessione = await db_1.prisma.sessione.create({
            data: {
                id_utente: utenteDb.id_utente,
                token: token
            }
        });
        return res.json({ id_sessione: sessione.id_sessione, token, id_utente: sessione.id_utente });
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
router.post('/signup', async (req, res) => {
    try {
        const data = auth_1.ClienteCreateSchema.parse(req.body);
        const hashedPassword = await (0, hashing_1.getPasswordHash)(data.password);
        const nuovoUtente = await db_1.prisma.utente.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                nome: data.nome,
                cognome: data.cognome,
                type: 'cliente',
                cliente: {
                    create: {
                        classe: data.classe
                    }
                }
            },
            include: { cliente: true }
        });
        const { password, ...publicData } = nuovoUtente;
        return res.json(publicData);
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
router.patch('/profilo', session_1.autenticaUtente, async (req, res) => {
    try {
        const data = auth_1.ClienteUpdateSchema.parse(req.body);
        const authUtente = req.utente;
        const clienteDaAggiornare = await db_1.prisma.utente.findUnique({
            where: { id_utente: authUtente.id_utente },
            include: { cliente: true } // Assuming only clientes update profile here
        });
        if (!clienteDaAggiornare || clienteDaAggiornare.type !== 'cliente') {
            return res.status(404).json({ detail: 'Utente non trovato o non è un cliente' });
        }
        const updateData = {};
        if (data.username)
            updateData.username = data.username;
        if (data.email)
            updateData.email = data.email;
        if (data.password)
            updateData.password = await (0, hashing_1.getPasswordHash)(data.password);
        if (data.nome)
            updateData.nome = data.nome;
        if (data.cognome)
            updateData.cognome = data.cognome;
        let clienteUpdateData = undefined;
        if (data.classe) {
            clienteUpdateData = { update: { classe: data.classe } };
        }
        const aggiornato = await db_1.prisma.utente.update({
            where: { id_utente: authUtente.id_utente },
            data: {
                ...updateData,
                cliente: clienteUpdateData
            },
            include: { cliente: true }
        });
        const { password, ...publicData } = aggiornato;
        return res.json(publicData);
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map
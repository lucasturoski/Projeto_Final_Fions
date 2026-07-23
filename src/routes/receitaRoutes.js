import express from "express";
import Receita from "../models/receita.js";
import { verificarAdm } from "../middleware/auth.js"

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const receitas = await Receita.find();
        res.json(receitas);
    } catch(error) {
        res.status(500).json({ erro: error.message });
    }
});

router.post("/", verificarAdm, async (req, res) => {
    try {
        const novaReceita = new Receita(req.body);

        await novaReceita.save();

        res.status(201).json({
            mensagem: "Receita cadastrada!",
            receita: novaReceita
        });
    } catch(error) {
        res.status(500).json({ erro: error.message });
    }
});

router.put("/:id", verificarAdm, async (req, res) => {
    try {
        const receita = await Receita.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!receita) {
            return res.status(404).json({
                mensagem: "Receita não encontrada!"
            });
        }

        res.json({
            mensagem: "Receita atualizada!",
            receita
        });
    } catch(error) {
        res.status(500).json({ erro: error.message });
    }
});

router.delete("/:id", verificarAdm, async (req, res) => {
    try {
        const receita = await Receita.findByIdAndDelete(req.params.id);

        if (!receita) {
            return res.status(404).json({
                mensagem: "Receita não encontrada!"
            });
        }

        res.json({
            mensagem: "Receita removida!"
        });
    } catch(error) {
        res.status(500).json({ erro: error.message });
    }
});

export default router;
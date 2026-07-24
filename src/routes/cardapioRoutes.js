import express from "express";
import Cardapio from "../models/cardapio.js";
import { verificarAdm } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const cardapio = await Cardapio.find();
        res.json(cardapio);
    } catch(error) {
        res.status(500).json({ erro: error.message });
    }
});

router.post("/", verificarAdm, async (req, res) => {
    try {
        const novoItem = new Cardapio(req.body);

        await novoItem.save();

        res.status(201).json({
            mensagem: "Item adicionado ao cardápio!",
            item: novoItem
        });

    } catch(error) {
        res.status(500).json({
            erro: error.message
        });
    }
});
router.put("/:id", verificarAdm, async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Cardapio.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!item) {
            return res.status(404).json({
                mensagem: "Item não encontrado!"
            });
        }

        res.json({
            mensagem: "Item atualizado!",
            item
        });

    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

router.delete("/:id", verificarAdm, async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Cardapio.findByIdAndDelete(id);

        if (!item) {
            return res.status(404).json({
                mensagem: "Item não encontrado!"
            });
        }

        res.json({
            mensagem: "Item removido com sucesso!"
        });

    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

export default router;
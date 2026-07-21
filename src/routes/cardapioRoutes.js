import express from "express";
import Cardapio from "../models/Cardapio.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const cardapio = await Cardapio.find();
        res.json(cardapio);
    } catch(error) {
        res.status(500).json({ erro: error.message });
    }
});


router.post("/", async (req, res) => {
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


export default router;
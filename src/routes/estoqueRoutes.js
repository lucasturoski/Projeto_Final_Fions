import express from "express";
import Estoque from "../models/Estoque.js";
import { verificarAdm, verificarFuncionario } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const estoque = await Estoque.find();
        res.json(estoque);
    } catch(error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

router.post("/", verificarAdm, async (req, res) => {
    try {
        const novoIngrediente = new Estoque(req.body);

        await novoIngrediente.save();

        res.status(201).json({
            mensagem: "Ingrediente adicionado com sucesso!",
            ingrediente: novoIngrediente
        });

    } catch(error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

router.put("/:id", verificarFuncionario, async (req, res) => {
    try {
        const ingrediente = await Estoque.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!ingrediente) {
            return res.status(404).json({
                mensagem: "Ingrediente não encontrado!"
            });
        }

        res.json({
            mensagem: "Ingrediente atualizado!",
            ingrediente
        });

    } catch(error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

router.delete("/:id", verificarAdm, async (req, res) => {
    try {
        const ingrediente = await Estoque.findByIdAndDelete(req.params.id);

        if (!ingrediente) {
            return res.status(404).json({
                mensagem: "Ingrediente não encontrado!"
            });
        }

        res.json({
            mensagem: "Ingrediente removido com sucesso!"
        });

    } catch(error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

export default router;
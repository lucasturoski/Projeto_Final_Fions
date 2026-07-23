import express from "express";
import Sugestao from "../models/sugestao.js";
import { verificarAdm, verificarFuncionario } from "../middleware/auth.js"

const router = express.Router();

router.get("/", verificarFuncionario, async (req, res) => {
    try {
        const sugestoes = await Sugestao.find();
        res.json(sugestoes);
    } catch(error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const novaSugestao = new Sugestao(req.body);

        await novaSugestao.save();

        res.status(201).json({
            mensagem: "Sugestão enviada com sucesso!",
            sugestao: novaSugestao
        });
    } catch(error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

router.delete("/:id", verificarAdm, async (req, res) => {
    try {
        const sugestao = await Sugestao.findByIdAndDelete(req.params.id);

        if (!sugestao) {
            return res.status(404).json({
                mensagem: "Sugestão não encontrada!"
            });
        }

        res.json({
            mensagem: "Sugestão removida!"
        });
    } catch(error) {
        res.status(500).json({
            erro: error.message
        });
    }
})

export default router;
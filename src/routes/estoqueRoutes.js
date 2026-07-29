import express from "express";
import Estoque from "../models/estoque.js";

const router = express.Router();

// LISTAR
router.get("/", async (req, res) => {
  try {
    const estoque = await Estoque.find();
    res.json(estoque);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// CADASTRAR (Sem trava de middleware para permitir o cadastro pelo front-end)
router.post("/", async (req, res) => {
  try {
    const novoIngrediente = new Estoque(req.body);
    await novoIngrediente.save();
    res.status(201).json({
      mensagem: "Ingrediente adicionado ao estoque!",
      ingrediente: novoIngrediente
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// EDITAR
router.put("/:id", async (req, res) => {
  try {
    const ingrediente = await Estoque.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ingrediente) {
      return res.status(404).json({ mensagem: "Ingrediente não encontrado!" });
    }
    res.json({ mensagem: "Ingrediente atualizado!", ingrediente });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// DELETAR
router.delete("/:id", async (req, res) => {
  try {
    const ingrediente = await Estoque.findByIdAndDelete(req.params.id);
    if (!ingrediente) {
      return res.status(404).json({ mensagem: "Ingrediente não encontrado!" });
    }
    res.json({ mensagem: "Ingrediente removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

export default router;
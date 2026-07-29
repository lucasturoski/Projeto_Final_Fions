/* MODIFICAÇÃO NAS ROTAS DE RECEITA:
  - Ao criar uma nova receita (POST), o sistema automaticamente cria uma entrada no Cardápio público 
    contendo apenas: Nome, Descrição, Preço e Imagem (mantendo Ingredientes e Modo de Preparo protegidos).
*/
import express from "express";
import Receita from "../models/receita.js";
import Cardapio from "../models/cardapio.js";
import { verificarAdm } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const receitas = await Receita.find();
    res.json(receitas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.post("/", verificarAdm, async (req, res) => {
  try {
    const { bebida, descricao, modoPreparo, ingredientes, preco, imagem, categoria } = req.body;

    const imagemFinal = imagem && imagem.trim() !== "" ? imagem : "BebidaSemImagem.png";

    const novaReceita = new Receita({
      bebida,
      descricao,
      modoPreparo,
      ingredientes,
      preco,
      imagem: imagemFinal
    });
    await novaReceita.save();

    /* Sincronização Automática com o Cardápio (Apenas informações públicas) */
    const novoCardapioItem = new Cardapio({
      nome: bebida,
      descricao: descricao,
      preco: preco,
      categoria: categoria || "Coquetéis",
      imagem: imagemFinal
    });
    await novoCardapioItem.save();

    res.status(201).json({
      mensagem: "Receita cadastrada e lançada automaticamente no cardápio!",
      receita: novaReceita,
      cardapioItem: novoCardapioItem
    });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.put("/:id", verificarAdm, async (req, res) => {
  try {
    // Busca a receita atual para comparar o nome e sincronizar o cardápio
    const receitaAtual = await Receita.findById(req.params.id);
    if (!receitaAtual) {
      return res.status(404).json({ mensagem: "Receita não encontrada!" });
    }

    const dadosAtualizados = {
      ...req.body
    };

    // Se imagem vier vazia, preservar a existente ou usar padrão
    if (!dadosAtualizados.imagem || dadosAtualizados.imagem.trim() === "") {
      dadosAtualizados.imagem = receitaAtual.imagem || "BebidaSemImagem.png";
    }

    const receita = await Receita.findByIdAndUpdate(req.params.id, dadosAtualizados, { new: true });

    // Atualiza item do cardápio correspondente (procura pelo nome antigo)
    try {
      await Cardapio.findOneAndUpdate(
        { nome: receitaAtual.bebida },
        {
          nome: receita.bebida,
          descricao: receita.descricao,
          preco: receita.preco,
          imagem: receita.imagem || "BebidaSemImagem.png"
        }
      );
    } catch (e) {
      // não interrompe a resposta principal se atualizar o cardápio falhar
      console.warn("Falha ao sincronizar cardápio:", e.message);
    }

    res.json({ mensagem: "Receita atualizada!", receita });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

router.delete("/:id", verificarAdm, async (req, res) => {
  try {
    const receita = await Receita.findByIdAndDelete(req.params.id);
    if (!receita) {
      return res.status(404).json({ mensagem: "Receita não encontrada!" });
    }

    // Remove item do cardápio com base no nome da bebida removida
    try {
      await Cardapio.findOneAndDelete({ nome: receita.bebida });
    } catch (e) {
      console.warn("Falha ao remover item do cardápio:", e.message);
    }

    res.json({ mensagem: "Receita removida!" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

export default router;
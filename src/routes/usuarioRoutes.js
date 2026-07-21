import express from "express";
import { SENHA_ADM, SENHA_FUNC } from "../config/senhas.js";

const router = express.Router();

router.post("/login", (req, res) => {
    try {
        const { nome, senha } = req.body;

        if (senha === SENHA_ADM) {
            return res.json({
                mensagem: "Login realizado com sucesso!",
                nome,
                tipo: "adm"
            });
        }

        if (senha === SENHA_FUNC) {
            return res.json({
                mensagem: "Login realizado com sucesso!",
                nome,
                tipo: "funcionario"
            });
        }

        return res.status(401).json({
            mensagem: "Senha incorreta!"
        });

    } catch(error) {
        res.status(500).json({
            erro: error.message
        });
    }
});

export default router;
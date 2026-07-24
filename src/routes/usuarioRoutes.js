import express from "express";
import { SENHA_ADM, SENHA_FUNC } from "../config/senhas.js";
import { criarToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", (req, res) => {
    try {
        const { nome, senha } = req.body;

        if (senha === SENHA_ADM) {
            const token = criarToken({ nome, tipo: "adm" });

            res.cookie("tipo", "adm", {
                httpOnly: false,
                sameSite: "lax",
                maxAge: 60 * 60 * 1000
            });
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 60 * 60 * 1000
            });

            return res.json({
                mensagem: "Login realizado com sucesso!",
                nome,
                tipo: "adm",
                token
            });
        }

        if (senha === SENHA_FUNC) {
            const token = criarToken({ nome, tipo: "funcionario" });

            res.cookie("tipo", "funcionario", {
                httpOnly: false,
                sameSite: "lax",
                maxAge: 60 * 60 * 1000
            });
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 60 * 60 * 1000
            });

            return res.json({
                mensagem: "Login realizado com sucesso!",
                nome,
                tipo: "funcionario",
                token
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
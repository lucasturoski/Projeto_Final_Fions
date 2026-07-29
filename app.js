import express from "express";
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import cardapioRoutes from "./src/routes/cardapioRoutes.js";
import estoqueRoutes from "./src/routes/estoqueRoutes.js";
import receitaRoutes from "./src/routes/receitaRoutes.js";
import sugestaoRoutes from "./src/routes/sugestaoRoutes.js"
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/usuarios", usuarioRoutes);
app.use("/cardapio", cardapioRoutes);
app.use("/estoque", estoqueRoutes);
// Compatibilidade: expõe rotas tanto no singular quanto no plural para o front-end existente
app.use("/receitas", receitaRoutes);
app.use("/receita", receitaRoutes);
app.use("/sugestoes", sugestaoRoutes);
app.use("/sugestao", sugestaoRoutes);

app.get("/", (req, res) => {
    res.send("API GastroBar funcionando!");
});

export default app;
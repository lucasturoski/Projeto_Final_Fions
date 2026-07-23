import express from "express";
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import cardapioRoutes from "./src/routes/cardapioRoutes.js";
import estoqueRoutes from "./src/routes/estoqueRoutes.js";
import receitaRoutes from "./src/routes/receitaRoutes.js";
import sugestaoRoutes from "./src/routes/sugestaoRoutes.js"

const app = express();

app.use(express.json());

app.use("/usuarios", usuarioRoutes);
app.use("/cardapio", cardapioRoutes);
app.use("/estoque", estoqueRoutes);
app.use("/receitas", receitaRoutes);
app.use("/sugestoes", sugestaoRoutes);

app.get("/", (req, res) => {
    res.send("API GastroBar funcionando!");
});

export default app;
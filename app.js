import express from "express";
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import cardapioRoutes from "./src/routes/cardapioRoutes.js";
import estoqueRoutes from "./src/routes/estoqueRoutes.js";

const app = express();

app.use(express.json());

app.use("/usuarios", usuarioRoutes);
app.use("/cardapio", cardapioRoutes);
app.use("/estoque", estoqueRoutes);

app.get("/", (req, res) => {
    res.send("API GastroBar funcionando!");
});

export default app;
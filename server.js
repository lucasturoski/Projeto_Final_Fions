import dotenv from "dotenv";
import app from "./app.js";
import conectarBanco from "./src/config/db.js";

dotenv.config();

conectarBanco();

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
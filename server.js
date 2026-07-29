import dotenv from "dotenv";
import app from "./app.js";
import conectarBanco from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await conectarBanco();

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error("Não foi possível iniciar o servidor:", error.message);
        process.exit(1);
    }
};

iniciarServidor()
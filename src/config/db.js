import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer = null;

const conectarBanco = async () => {
    const tryConnect = async (uri) => {
        await mongoose.connect(uri, { dbName: process.env.DB_NAME || undefined });
    };

    // 1) Tenta conectar com MONGO_URI se fornecida
    if (process.env.MONGO_URI) {
        try {
            await tryConnect(process.env.MONGO_URI);
            console.log("MongoDB conectado via MONGO_URI");
            return;
        } catch (err) {
            console.log("Falha ao conectar com MONGO_URI:", err.message);
        }
    } else {
        console.log('MONGO_URI não fornecida — tentando fallback.');
    }

    // 2) Fallback: iniciar um MongoDB em memória (apenas para desenvolvimento/testes)
    try {
        console.log("Iniciando MongoDB em memória para fallback...");
        memoryServer = await MongoMemoryServer.create();
        const uri = memoryServer.getUri();
        await tryConnect(uri);
        console.log("MongoDB em memória conectado (fallback). Todos os dados serão temporários.");
    } catch (err) {
        console.log("Erro ao iniciar MongoDB em memória:", err.message);
        throw err; // Não continuar se nem o fallback funcionou
    }
};

export const stopMemoryServer = async () => {
    if (memoryServer) {
        await mongoose.disconnect();
        await memoryServer.stop();
        memoryServer = null;
    }
};

export default conectarBanco;
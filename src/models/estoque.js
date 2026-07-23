import mongoose from "mongoose"

const estoqueSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    quantidade: {
        type: Number,
        required: true
    },
    unidade: {
        type: String,
        required: true
    }
});

const Estoque = mongoose.model("Estoque", estoqueSchema);

export default Estoque;
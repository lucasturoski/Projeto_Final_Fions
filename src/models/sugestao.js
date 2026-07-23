import mongoose from "mongoose"

const sugestaoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    mensagem: {
        type: String,
        required: true
    }
});

const Sugestao = mongoose.model("Sugestao", sugestaoSchema);

export default Sugestao;
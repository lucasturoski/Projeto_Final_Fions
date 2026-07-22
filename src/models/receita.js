import mongoose from "mongoose";

const receitaSchema = new mongoose.Schema({
    bebida: {
        type: String,
        required: true
    },
    ingredientes: [{
        type: String,
        required: true
    }]
});

const Receita = mongoose.model("Receita", receitaSchema);

export default Receita;
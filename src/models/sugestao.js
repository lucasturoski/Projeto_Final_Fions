/* MODIFICAÇÃO NO MODEL DE SUGESTÕES:
  - Adicionado o campo 'telefone' como obrigatório (required: true) para retornos de agradecimento.
*/
import mongoose from "mongoose";

const sugestaoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  telefone: {
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
/* MODIFICAÇÃO NO MODEL DE RECEITAS:
  - Adicionados os campos 'descricao' e 'modoPreparo' do tipo String e obrigatórios (required: true).
  - Adicionado o campo 'imagem' (com valor padrão 'BebidaSemImagem.png') para ser utilizado no cardápio público.
  - Adicionado o campo 'preco' para poder gerar o item correspondente no cardápio de forma automática.
*/
import mongoose from "mongoose";

const receitaSchema = new mongoose.Schema({
  bebida: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  modoPreparo: {
    type: String,
    required: true
  },
  ingredientes: [{
    type: String,
    required: true
  }],
  preco: {
    type: Number,
    required: true
  },
  imagem: {
    type: String,
    default: "BebidaSemImagem.png"
  }
});

const Receita = mongoose.model("Receita", receitaSchema);
export default Receita;
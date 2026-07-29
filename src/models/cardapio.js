/* MODIFICAÇÃO NO MODEL DO CARDÁPIO:
  - Adicionado o campo 'descricao' e o campo 'imagem' (padrão: 'BebidaSemImagem.png')
    para sincronizar perfeitamente com os dados públicos da receita.
*/
import mongoose from "mongoose";

const cardapioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  imagem: {
    type: String,
    default: "BebidaSemImagem.png"
  }
});

const Cardapio = mongoose.model("Cardapio", cardapioSchema);
export default Cardapio;
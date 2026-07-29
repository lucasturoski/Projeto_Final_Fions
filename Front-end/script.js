const API_BASE = "http://localhost:3000";
let usuarioAtual = null; // 'adm' ou 'funcionario'

document.addEventListener("DOMContentLoaded", () => {
  carregarCardapio();
});

/* Visualização do Cliente */
async function carregarCardapio() {
  try {
    // Buscando da rota /receita para unificar com o cadastro
    const res = await fetch(`${API_BASE}/receita`);
    const itens = await res.json();
    const container = document.getElementById("grid-cardapio");
    if (!container) return;
    
    container.innerHTML = "";

    itens.forEach(item => {
      const img = item.imagem && item.imagem.trim() !== "" ? item.imagem : "BebidaSemImagem.png";
      const precoNum = parseFloat(item.preco) || 0;
      const nomeExibicao = item.bebida || item.nome || "Sem Nome";

      container.innerHTML += `
        <div class="card-item">
          <img src="${img}" class="card-img" onerror="this.src='BebidaSemImagem.png'">
          <div class="card-body">
            <h4 class="card-title">${nomeExibicao}</h4>
            <p class="card-desc">${item.descricao || ''}</p>
            <p class="card-price">R$ ${precoNum.toFixed(2)}</p>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Erro ao carregar cardápio:", error);
  }
}

async function enviarSugestao(e) {
  e.preventDefault();
  const nome = document.getElementById("sug-nome").value;
  const telefone = document.getElementById("sug-telefone").value;
  const mensagem = document.getElementById("sug-mensagem").value;

  try {
    const res = await fetch(`${API_BASE}/sugestao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, telefone, mensagem })
    });
    if (res.ok) {
      alert("Agradecemos sua sugestão!");
      document.getElementById("form-sugestao").reset();
    }
  } catch (err) {
    alert("Erro ao enviar sugestão.");
  }
}

/* Modais e Autenticação */
function abrirModalLogin() {
  document.getElementById("modal-login").classList.remove("hidden");
}

function fecharModalLogin() {
  document.getElementById("modal-login").classList.add("hidden");
}

function autenticarUsuario() {
  const cargo = document.getElementById("input-cargo").value.toLowerCase().trim();
  if (cargo === "adm" || cargo === "funcionario") {
    usuarioAtual = cargo;
    fecharModalLogin();
    configurarPainel();
  } else {
    alert("Cargo inválido! Digite 'adm' ou 'funcionario'.");
  }
}

function configurarPainel() {
  document.getElementById("view-cliente").classList.add("hidden");
  document.getElementById("view-painel").classList.remove("hidden");
  
  document.getElementById("painel-titulo").innerText = `Painel de Gestão (${usuarioAtual.toUpperCase()})`;

  if (usuarioAtual === "adm") {
    document.querySelectorAll(".admin-only").forEach(el => el.classList.remove("hidden"));
    document.getElementById("modulo-receitas").classList.remove("hidden");
  } else if (usuarioAtual === "funcionario") {
    document.querySelectorAll(".admin-only").forEach(el => el.classList.add("hidden"));
    document.getElementById("modulo-receitas").classList.remove("hidden");
  }

  carregarEstoque();
  carregarReceitas();
  carregarSugestoes();
}

function fazerLogout() {
  usuarioAtual = null;
  document.getElementById("view-painel").classList.add("hidden");
  document.getElementById("view-cliente").classList.remove("hidden");
}

/* Funções de Estoque */
async function carregarEstoque() {
  try {
    const res = await fetch(`${API_BASE}/estoque`);
    const itens = await res.json();
    const tbody = document.getElementById("tabela-estoque");
    if (!tbody) return;
    
    tbody.innerHTML = "";

    // ⚠️ Só faz a varredura se a resposta for realmente uma lista (Array)
    if (Array.isArray(itens)) {
      itens.forEach(item => {
        tbody.innerHTML += `
          <tr>
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
            <td>${item.unidade}</td>
            <td>
              <button onclick="preencherEdicaoEstoque('${item._id}', '${item.nome}', ${item.quantidade}, '${item.unidade}')">Editar</button>
              <button onclick="deletarEstoque('${item._id}')">Excluir</button>
            </td>
          </tr>
        `;
      });
    } else {
      console.warn("Servidor não retornou uma lista válida de estoque:", itens);
    }
  } catch (error) {
    console.error("Erro ao carregar estoque:", error);
  }
}

/* Funções de Receitas */
async function carregarReceitas() {
  try {
    const res = await fetch(`${API_BASE}/receita`);
    const receitas = await res.json();
    const container = document.getElementById("lista-receitas");
    container.innerHTML = "";

    receitas.forEach(r => {
      const listaIngredientes = Array.isArray(r.ingredientes) ? r.ingredientes.join(", ") : r.ingredientes;
      const precoNum = parseFloat(r.preco) || 0;

      container.innerHTML += `
        <div style="border: 1px solid #333; padding: 10px; margin-top: 10px;">
          <h4>${r.bebida} - R$ ${precoNum.toFixed(2)}</h4>
          <p><strong>Categoria:</strong> ${r.categoria || 'Geral'}</p>
          <p><strong>Descrição:</strong> ${r.descricao}</p>
          <p><strong>Ingredientes:</strong> ${listaIngredientes}</p>
          <p><strong>Preparo:</strong> ${r.modoPreparo || r.preparo || ''}</p>
          ${usuarioAtual === 'adm' ? `<button onclick="deletarReceita('${r._id}')">Excluir</button>` : ''}
        </div>
      `;
    });
  } catch (error) {
    console.error("Erro ao carregar receitas:", error);
  }
}

async function salvarReceita(e) {
  e.preventDefault();
  const bebida = document.getElementById("rec-bebida").value;
  const preco = parseFloat(document.getElementById("rec-preco").value);
  const categoria = document.getElementById("rec-categoria").value;
  const imagem = document.getElementById("rec-imagem").value;
  const descricao = document.getElementById("rec-descricao").value;
  const modoPreparo = document.getElementById("rec-preparo").value;
  const ingredientes = document.getElementById("rec-ingredientes").value.split(",").map(i => i.trim());

  const headers = { "Content-Type": "application/json" };
  if (usuarioAtual) headers.tipo = usuarioAtual;

  await fetch(`${API_BASE}/receita`, {
    method: "POST",
    headers,
    body: JSON.stringify({ bebida, preco, categoria, imagem, descricao, modoPreparo, ingredientes })
  });

  document.getElementById("form-receita").reset();
  
  // Atualiza as receitas do painel E o cardápio principal
  await carregarReceitas();
  await carregarCardapio();
}

async function deletarReceita(id) {
  const headers = usuarioAtual ? { tipo: usuarioAtual } : {};
  await fetch(`${API_BASE}/receita/${id}`, { method: "DELETE", headers });
  carregarReceitas();
  carregarCardapio();
}

/* Sugestões */
async function carregarSugestoes() {
  try {
    const headers = usuarioAtual ? { tipo: usuarioAtual } : {};
    const res = await fetch(`${API_BASE}/sugestao`, { headers });
    const sugestoes = await res.json();
    const container = document.getElementById("lista-sugestoes");
    container.innerHTML = "";

    sugestoes.forEach(s => {
      container.innerHTML += `
        <div style="background: #222; padding: 10px; margin-bottom: 10px;">
          <p><strong>${s.nome}</strong> (${s.telefone})</p>
          <p>${s.mensagem}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error("Erro ao carregar sugestões:", error);
  }
}
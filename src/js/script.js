//  CARDS
const produtos = [
  {
    id: 1,
    nome: "Shineray She-S ",
    descricao: "Projetada para quem busca economia, praticidade e deslocamento diário sem o uso de gasolina.",
    preco: 19290,
    imagem: "./src/assets/Shineray She-S.jpg",
  },
  {
    id: 2,
    nome: "Voltz EVS ",
    descricao: "A Voltz EVS é a motocicleta elétrica mais vendida do Brasil. Seu motor gera os mesmos 3kW,com uma velocidade máxima de 120 km/h.",
    preco: 19990,
    imagem: "./src/assets/Voltz EVS.jpg",
  },
  {
    id: 3,
    nome: "Watts 125",
    descricao: "A autonomia da bateria única de lítio e 72V é de 75 km. O motor de 3 kW (4 cv) oferece uma velocidade máxima de 95 km/h.",
    preco: 19990,
    imagem: "./src/assets/Watts 125.jpg",
  },
  {
    id: 4,
    nome: "Super Soco TC",
    descricao: "Ela promete 100 km de autonomia com apenas uma bateria e é movida por um motor de 1,9 kW (2,5 cv), atingindo 90 km/h. ",
    preco: 21900,
    imagem: "./src/assets/Super Soco TC.jpg",
  },
  {
    id: 5,
    nome: "Super Soco TC Max",
    descricao: "Sua bateria de 72V, consegue alcançar uma autonomia de 140 km com apenas uma bateria, possui um tempo de recarga total de 7 horas.",
    preco: 34900,
    imagem: "./src/assets/Super Soco TC Max.jpg",
  },
];
// FUNÇÕES
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
function getCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho") || "[]");
}
function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}
//INDEX — CARDS
function renderizarProdutos() {
  const lista = document.getElementById("lista-produtos");
  if (!lista) return;
  lista.innerHTML = "";
  produtos.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card-produto";
    card.style.animationDelay = `${i * 0.08}s`;
    card.style.animation = "fadeUp 0.5s ease both";
    card.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
      <div class="card-info">
        <h3>${p.nome}</h3>
        <p>${p.descricao}</p>
        <div class="card-preco">${formatarPreco(p.preco)}</div>
        <button class="btn-add" onclick="adicionarAoCarrinho(${p.id})">
          + Adicionar ao Carrinho
        </button>
      </div>
    `;
    lista.appendChild(card);
  });
  if (!document.getElementById("kf-fadeUp")) {
    const style = document.createElement("style");
    style.id = "kf-fadeUp";
    style.textContent = `
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
  // Torna o link do carrinho funcional
  const linkCarrinho = document.querySelector(".carrinho");
  if (linkCarrinho) {
    linkCarrinho.addEventListener("click", () => {
      window.location.href = "./pages/loja.html";
    });
    atualizarBadge(linkCarrinho);
  }
}
function atualizarBadge(linkCarrinho) {
  const carrinho = getCarrinho();
  const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  let badge = document.getElementById("badge-cart");
  if (!badge) {
    badge = document.createElement("span");
    badge.id = "badge-cart";
    linkCarrinho.appendChild(badge);
  }
  badge.textContent = total > 0 ? total : "";
  badge.style.display = total > 0 ? "inline-flex" : "none";
}
function adicionarAoCarrinho(id) {
  const produto = produtos.find((p) => p.id === id);
  if (!produto) return;
  const carrinho = getCarrinho();
  const existente = carrinho.find((item) => item.id === id);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }
  salvarCarrinho(carrinho);
  mostrarToast(`${produto.nome} adicionado ao carrinho!`);
  const linkCarrinho = document.querySelector(".carrinho");
  if (linkCarrinho) atualizarBadge(linkCarrinho);
}
function mostrarToast(msg) {
  let toast = document.getElementById("toast-global");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-global";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2500);
}
// LOJA (CARRINHO)
let descontoAplicado = false;
function calcularTotal(carrinho) {
  return carrinho.reduce((acumulador, item) => {
    return acumulador + item.preco * item.quantidade;
  }, 0);
}
function calcularTotalComDesconto(carrinho) {
  const totalBruto = calcularTotal(carrinho);
  // Aplica 10% de desconto usando reduce via multiplicação
  return [totalBruto, totalBruto * 0.9].reduce((_, comDesconto) => comDesconto);
}
function atualizarExibicaoTotal(valor) {
  const spanTotal = document.getElementById("total-compra");
  if (!spanTotal) return;
  spanTotal.textContent = valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const exibicao = document.getElementById("valor-total-exibicao");
  if (exibicao && !exibicao.querySelector(".prefixo")) {
    exibicao.innerHTML = `<span class="prefixo" style="font-size:1rem;color:var(--text-muted);margin-right:4px">R$</span><span id="total-compra">${spanTotal.textContent}</span>`;
  } else if (exibicao) {
    const s = exibicao.querySelector("#total-compra");
    if (s) s.textContent = spanTotal.textContent;
  }
}
function renderizarItensCarrinho() {
  const lista = document.getElementById("lista-carrinho-itens");
  if (!lista) return;
  const carrinho = getCarrinho();
  if (carrinho.length === 0) {
    lista.innerHTML = `
      <div class="carrinho-vazio">
        <div class="icon">🛒</div>
        <p>Seu carrinho está vazio.<br>
        <a href="../index.html" style="color:var(--accent);text-decoration:none">Voltar ao catálogo →</a></p>
      </div>
    `;
    atualizarExibicaoTotal(0);
    return;
  }
  lista.innerHTML = "";
  carrinho.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "item-carrinho";
    div.style.animationDelay = `${i * 0.07}s`;
    div.innerHTML = `
      <div class="item-info">
        <div class="item-nome">${item.nome}</div>
        <div class="item-qtd">Qtd: ${item.quantidade}</div>
      </div>
      <div class="item-preco">${formatarPreco(item.preco * item.quantidade)}</div>
    `;
    lista.appendChild(div);
  });
  const total = calcularTotal(carrinho);
  atualizarExibicaoTotal(total);
  descontoAplicado = false;
  // Resetar visual do botão de desconto
  const btnDesconto = document.getElementById("btn-desconto");
  if (btnDesconto) {
    btnDesconto.disabled = false;
    btnDesconto.textContent = "Aplicar desconto (10%)";
    const badge = document.querySelector(".desconto-badge");
    if (badge) badge.remove();
}}
function aplicarDesconto() {
  if (descontoAplicado) return;
  const carrinho = getCarrinho();
  if (carrinho.length === 0) return;
  const totalComDesconto = calcularTotalComDesconto(carrinho);
  atualizarExibicaoTotal(totalComDesconto);
  descontoAplicado = true;
  // Feedback visual
  const btnDesconto = document.getElementById("btn-desconto");
  if (btnDesconto) {
    btnDesconto.disabled = true;
    btnDesconto.textContent = "Desconto aplicado ✓";
    // Adiciona badge
    const totalSecao = document.querySelector(".total-secao h2");
    if (totalSecao && !document.querySelector(".desconto-badge")) {
      const badge = document.createElement("span");
      badge.className = "desconto-badge";
      badge.textContent = "-10%";
      totalSecao.appendChild(badge);
    }
  }
}
function finalizarCompra() {
  const carrinho = getCarrinho();
  if (carrinho.length === 0) {
    mostrarToast("Seu carrinho está vazio!");
    return;
  }
  // Limpa o carrinho
  salvarCarrinho([]);
  // Cria e exibe modal de sucesso
  let overlay = document.getElementById("modal-sucesso");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "modal-sucesso";
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="icon">✅</div>
        <h2>Compra Finalizada!</h2>
        <p>Obrigado pela sua compra na ShowMotors.<br>Sua moto elétrica está a caminho!</p>
        <button class="modal-close" onclick="fecharModal()">Voltar ao início</button>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  setTimeout(() => overlay.classList.add("show"), 10);
}
function fecharModal() {
  const overlay = document.getElementById("modal-sucesso");
  if (overlay) {
    overlay.classList.remove("show");
    setTimeout(() => window.location.href = "../index.html", 300);
  }
}
// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  // Index
  renderizarProdutos();
  // Loja
  renderizarItensCarrinho();
  const btnDesconto = document.getElementById("btn-desconto");
  if (btnDesconto) {
    btnDesconto.addEventListener("click", aplicarDesconto);
  }
});
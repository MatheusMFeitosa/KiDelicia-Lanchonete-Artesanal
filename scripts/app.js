// CONSTANTES DE CONFIGURAÇÃO
const CHAVE_CARRINHO = "kidelicia.carrinho";
const CHAVE_TEMA = "kidelicia.tema";
const FRETE_GRATIS_ACIMA = 80;
const VALOR_FRETE = 8;
const QUANTIDADE_MINIMA = 1;
const QUANTIDADE_MAXIMA = 10;

// ESTADO DA APLICAÇÃO
let categoriaSelecionada = "todas";
let termoBusca = "";
let ordemSelecionada = "relevancia";
let temporizadorAviso = null;

// UTILITÁRIOS PUROS
function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function criarIcone(...classesIcone) {
    const icone = document.createElement("i");
    icone.classList.add(...classesIcone);
    icone.setAttribute("aria-hidden", "true");
    return icone;
}

function mostrarAviso(mensagem) {
    const aviso = document.getElementById("aviso_flutuante");
    aviso.textContent = mensagem;
    aviso.classList.add("visivel");

    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => {
        aviso.classList.remove("visivel");
    }, 2400);
}

// ARMAZENAMENTO
function getCarrinho() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
    } catch {
        return [];
    }
}

function setCarrinho(carrinhoArray) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinhoArray));
}

// FILTRAGEM E ORDENAÇÃO DO CARDÁPIO
function filtrarEOrdenarProdutos() {
    const buscaNormalizada = normalizarTexto(termoBusca);

    const produtosFiltrados = LISTA_PRODUTOS.filter((produto) => {
        const bateCategoria =
            categoriaSelecionada === "todas" || produto.categoria === categoriaSelecionada;
        const nomeNormalizado = normalizarTexto(produto.nomeProduto);
        const descricaoNormalizada = normalizarTexto(produto.descricao);
        const batePesquisa =
            nomeNormalizado.includes(buscaNormalizada) ||
            descricaoNormalizada.includes(buscaNormalizada);

        return bateCategoria && batePesquisa;
    });

    ordenarListaProdutos(produtosFiltrados);
    mostrarProdutosTela(produtosFiltrados);
}

function ordenarListaProdutos(lista) {
    if (ordemSelecionada === "menor-preco") {
        lista.sort((a, b) => a.precoProduto - b.precoProduto);
    } else if (ordemSelecionada === "maior-preco") {
        lista.sort((a, b) => b.precoProduto - a.precoProduto);
    } else if (ordemSelecionada === "avaliacao") {
        lista.sort((a, b) => b.avaliacao - a.avaliacao);
    }
}

function limparFiltrosAtivos() {
    termoBusca = "";
    categoriaSelecionada = "todas";

    document.getElementById("barra_pesquisa").value = "";

    const botoesCategoria = document.querySelectorAll("#menu_categorias button");
    botoesCategoria.forEach((botao) => {
        const ehTodas = botao.dataset.categoria === "todas";
        botao.classList.toggle("ativo", ehTodas);
        botao.setAttribute("aria-pressed", ehTodas);
    });

    filtrarEOrdenarProdutos();
}

// RENDERIZAÇÃO DO CARDÁPIO
function mostrarProdutosTela(produtosTela) {
    const containerProdutos = document.getElementById("lista_produtos");
    const contadorProdutos = document.getElementById("contador_produtos");

    containerProdutos.replaceChildren();
    contadorProdutos.textContent = `${produtosTela.length} ${produtosTela.length === 1 ? "item" : "itens"}`;

    if (produtosTela.length === 0) {
        renderizarEstadoVazioCardapio(containerProdutos);
        return;
    }

    for (let i = 0; i < produtosTela.length; i++) {
        adicionarProdutoHTML(produtosTela[i], containerProdutos);
    }
}

function renderizarEstadoVazioCardapio(containerDestino) {
    const divVazia = document.createElement("div");
    const tituloVazio = document.createElement("h3");
    const textoVazio = document.createElement("p");
    const botaoLimpar = document.createElement("button");

    divVazia.classList.add("estado-vazio");
    botaoLimpar.classList.add("botao-limpar-filtros");
    botaoLimpar.type = "button";

    tituloVazio.textContent = "Nenhum lanche encontrado";
    textoVazio.textContent = "Não encontramos resultados para a sua busca ou filtro atual.";
    botaoLimpar.textContent = "Limpar filtros e ver tudo";

    botaoLimpar.addEventListener("click", limparFiltrosAtivos);

    divVazia.append(criarIcone("fa-solid", "fa-magnifying-glass"), tituloVazio, textoVazio, botaoLimpar);
    containerDestino.append(divVazia);
}

function criarAvaliacaoEstrelas(notaAvaliacao) {
    const divAvaliacao = document.createElement("div");
    const spanNota = document.createElement("span");
    const estrelasCheias = Math.round(notaAvaliacao);

    divAvaliacao.classList.add("avaliacao-produto");
    divAvaliacao.setAttribute("role", "img");
    divAvaliacao.setAttribute("aria-label", `Avaliação ${notaAvaliacao.toFixed(1)} de 5 estrelas`);

    for (let i = 0; i < 5; i++) {
        const classeEstilo = i < estrelasCheias ? "fa-solid" : "fa-regular";
        divAvaliacao.append(criarIcone(classeEstilo, "fa-star"));
    }

    spanNota.textContent = notaAvaliacao.toFixed(1);
    divAvaliacao.append(spanNota);

    return divAvaliacao;
}

function criarSeletorQuantidadeCard(aoAlterar) {
    let quantidadeAtual = QUANTIDADE_MINIMA;

    const divContainerQuantidade = document.createElement("div");
    const labelQuantidade = document.createElement("p");
    const divQuantidade = document.createElement("div");
    const botaoDiminuir = document.createElement("button");
    const spanQuantidade = document.createElement("span");
    const botaoAumentar = document.createElement("button");

    divContainerQuantidade.classList.add("container-quantidade");
    divQuantidade.classList.add("quantidade");
    botaoDiminuir.classList.add("botao-qtd");
    botaoAumentar.classList.add("botao-qtd");

    botaoDiminuir.type = "button";
    botaoAumentar.type = "button";
    botaoDiminuir.setAttribute("aria-label", "Diminuir quantidade");
    botaoAumentar.setAttribute("aria-label", "Aumentar quantidade");

    labelQuantidade.textContent = "Quantidade";
    spanQuantidade.textContent = quantidadeAtual;
    botaoDiminuir.disabled = true;

    botaoDiminuir.append(criarIcone("fa-solid", "fa-minus"));
    botaoAumentar.append(criarIcone("fa-solid", "fa-plus"));

    function atualizarEstadoBotoes(novoValor) {
        quantidadeAtual = novoValor;
        spanQuantidade.textContent = quantidadeAtual;
        botaoDiminuir.disabled = quantidadeAtual <= QUANTIDADE_MINIMA;
        botaoAumentar.disabled = quantidadeAtual >= QUANTIDADE_MAXIMA;
        aoAlterar(quantidadeAtual);
    }

    botaoDiminuir.addEventListener("click", () => {
        if (quantidadeAtual > QUANTIDADE_MINIMA) {
            atualizarEstadoBotoes(quantidadeAtual - 1);
        }
    });

    botaoAumentar.addEventListener("click", () => {
        if (quantidadeAtual < QUANTIDADE_MAXIMA) {
            atualizarEstadoBotoes(quantidadeAtual + 1);
        }
    });

    divQuantidade.append(botaoDiminuir, spanQuantidade, botaoAumentar);
    divContainerQuantidade.append(labelQuantidade, divQuantidade);

    return {
        elemento: divContainerQuantidade,
        resetar: () => atualizarEstadoBotoes(QUANTIDADE_MINIMA)
    };
}

function adicionarProdutoHTML(produto, containerDestino) {
    let quantidadeSelecionada = QUANTIDADE_MINIMA;

    const divProduto = document.createElement("article");
    const spanSelo = document.createElement("span");
    const imgProduto = document.createElement("img");
    const h3Produto = document.createElement("h3");
    const descricaoProduto = document.createElement("p");
    const divCompra = document.createElement("div");
    const precoProduto = document.createElement("p");
    const botaoAdicionar = document.createElement("button");

    divProduto.classList.add("produto", produto.categoria);
    spanSelo.classList.add("selo-categoria");
    descricaoProduto.classList.add("descricao-produto");
    divCompra.classList.add("compra");
    precoProduto.classList.add("preco-produto");

    imgProduto.src = `imagens/${produto.nomeProduto}.jpg`;
    imgProduto.alt = produto.nomeProduto;
    imgProduto.loading = "lazy";

    spanSelo.textContent = produto.rotulo;
    h3Produto.textContent = produto.nomeProduto;
    descricaoProduto.textContent = produto.descricao;
    precoProduto.textContent = formatarMoeda(produto.precoProduto);

    const seletorQuantidade = criarSeletorQuantidadeCard((novaQtd) => {
        quantidadeSelecionada = novaQtd;
    });

    botaoAdicionar.type = "button";
    botaoAdicionar.textContent = " Adicionar";
    botaoAdicionar.prepend(criarIcone("fa-solid", "fa-cart-plus"));

    botaoAdicionar.addEventListener("click", () => {
        adicionarQuantidadeProduto(produto.nomeProduto, quantidadeSelecionada);
        seletorQuantidade.resetar();
    });

    divCompra.append(precoProduto, botaoAdicionar);

    divProduto.append(
        spanSelo,
        imgProduto,
        h3Produto,
        criarAvaliacaoEstrelas(produto.avaliacao),
        descricaoProduto,
        seletorQuantidade.elemento,
        divCompra
    );

    containerDestino.append(divProduto);
}

// CARRINHO
function adicionarQuantidadeProduto(nomeProduto, quantidadeEscolhida) {
    const produtoDb = LISTA_PRODUTOS.find((p) => p.nomeProduto === nomeProduto);
    if (!produtoDb) return;

    const carrinho = getCarrinho();
    const indexItem = carrinho.findIndex((item) => item.nomeProduto === nomeProduto);

    if (indexItem !== -1) {
        carrinho[indexItem].quantidade += quantidadeEscolhida;
    } else {
        carrinho.push({
            nomeProduto: produtoDb.nomeProduto,
            precoProduto: produtoDb.precoProduto,
            quantidade: quantidadeEscolhida
        });
    }

    setCarrinho(carrinho);
    mostrarAviso(`${quantidadeEscolhida}x ${nomeProduto} adicionado ao pedido!`);
    atualizarTelaCarrinho();
}

function alterarQuantidadeCarrinho(nomeProduto, variacao) {
    const carrinho = getCarrinho();
    const indexItem = carrinho.findIndex((item) => item.nomeProduto === nomeProduto);

    if (indexItem === -1) return;

    carrinho[indexItem].quantidade += variacao;

    if (carrinho[indexItem].quantidade <= 0) {
        carrinho.splice(indexItem, 1);
        mostrarAviso(`${nomeProduto} removido do pedido.`);
    }

    setCarrinho(carrinho);
    atualizarTelaCarrinho();
}

function deletarItemCarrinho(nomeProduto) {
    const carrinho = getCarrinho();
    const novoCarrinho = carrinho.filter((item) => item.nomeProduto !== nomeProduto);

    setCarrinho(novoCarrinho);
    mostrarAviso(`${nomeProduto} removido do pedido.`);
    atualizarTelaCarrinho();
}

function calcularResumoCarrinho(carrinho) {
    let subtotal = 0;
    let totalItens = 0;

    for (let i = 0; i < carrinho.length; i++) {
        subtotal += carrinho[i].precoProduto * carrinho[i].quantidade;
        totalItens += carrinho[i].quantidade;
    }

    const temFreteGratis = subtotal === 0 || subtotal >= FRETE_GRATIS_ACIMA;
    const frete = temFreteGratis ? 0 : VALOR_FRETE;
    const total = subtotal + frete;

    return { subtotal, totalItens, frete, total };
}

// RENDERIZAÇÃO DO CARRINHO
function atualizarProgressoFrete(subtotal) {
    const textoFrete = document.getElementById("texto_progresso_frete");
    const barraPreenchimento = document.getElementById("barra_progresso_preenchimento");

    if (subtotal === 0) {
        textoFrete.textContent = `Adicione ${formatarMoeda(FRETE_GRATIS_ACIMA)} para ganhar Frete Grátis!`;
        barraPreenchimento.style.width = "0%";
        return;
    }

    if (subtotal >= FRETE_GRATIS_ACIMA) {
        textoFrete.textContent = "Parabéns! Você ganhou Entrega Grátis neste pedido!";
        barraPreenchimento.style.width = "100%";
        return;
    }

    const valorFaltante = FRETE_GRATIS_ACIMA - subtotal;
    const porcentagem = Math.min(100, (subtotal / FRETE_GRATIS_ACIMA) * 100);

    textoFrete.textContent = `Faltam só ${formatarMoeda(valorFaltante)} para Entrega Grátis!`;
    barraPreenchimento.style.width = `${porcentagem}%`;
}

function atualizarTelaCarrinho() {
    const listaProdutosCarrinho = document.getElementById("itens_carrinho");
    listaProdutosCarrinho.replaceChildren();

    const carrinho = getCarrinho();
    const resumo = calcularResumoCarrinho(carrinho);

    if (carrinho.length === 0) {
        const liVazio = document.createElement("li");
        const textoVazio = document.createElement("h4");
        liVazio.classList.add("mensagem-carrinho-vazio");
        textoVazio.textContent = "Seu carrinho está vazio no momento...";
        liVazio.append(criarIcone("fa-solid", "fa-basket-shopping"), textoVazio);
        listaProdutosCarrinho.append(liVazio);
    } else {
        for (let i = 0; i < carrinho.length; i++) {
            adicionarElementoItemCarrinho(carrinho[i], listaProdutosCarrinho);
        }
    }

    // Atualiza contador na bolinha do ícone do carrinho
    const botaoCarrinhoTopo = document.getElementById("botao_carrinho");
    if (resumo.totalItens > 0) {
        botaoCarrinhoTopo.setAttribute("data-after", resumo.totalItens);
        botaoCarrinhoTopo.classList.add("ativo");
    } else {
        botaoCarrinhoTopo.classList.remove("ativo");
    }

    // Atualiza barra de frete grátis e totais
    atualizarProgressoFrete(resumo.subtotal);

    document.getElementById("valor_subtotal").textContent = formatarMoeda(resumo.subtotal);
    document.getElementById("valor_frete").textContent =
        resumo.subtotal > 0 && resumo.frete === 0 ? "Grátis" : formatarMoeda(resumo.frete);
    document.getElementById("valor_total").textContent = formatarMoeda(resumo.total);

    // Prevenção de erro: desabilita botão finalizar quando vazio
    document.getElementById("botao_finalizar").disabled = carrinho.length === 0;
}

function adicionarElementoItemCarrinho(item, listaDestino) {
    const liProduto = document.createElement("li");
    const divInfo = document.createElement("div");
    const imgProduto = document.createElement("img");
    const divDetalhes = document.createElement("div");
    const h4Nome = document.createElement("h4");
    const pPreco = document.createElement("p");
    const divControlesQtd = document.createElement("div");
    const btnDiminuir = document.createElement("button");
    const spanQtd = document.createElement("span");
    const btnAumentar = document.createElement("button");
    const btnDeletar = document.createElement("button");

    divInfo.classList.add("info-produto");
    divDetalhes.classList.add("detalhes-item-carrinho");
    pPreco.classList.add("preco-item");
    divControlesQtd.classList.add("controles-qtd-carrinho");
    btnDiminuir.classList.add("botao-qtd");
    btnAumentar.classList.add("botao-qtd");
    btnDeletar.classList.add("botao-deletar-item");

    btnDiminuir.type = "button";
    btnAumentar.type = "button";
    btnDeletar.type = "button";

    btnDiminuir.setAttribute("aria-label", `Diminuir quantidade de ${item.nomeProduto}`);
    btnAumentar.setAttribute("aria-label", `Aumentar quantidade de ${item.nomeProduto}`);
    btnDeletar.setAttribute("aria-label", `Remover ${item.nomeProduto} do carrinho`);

    imgProduto.src = `imagens/${item.nomeProduto}.jpg`;
    imgProduto.alt = item.nomeProduto;

    h4Nome.textContent = item.nomeProduto;
    pPreco.textContent = formatarMoeda(item.precoProduto * item.quantidade);
    spanQtd.textContent = item.quantidade;

    btnDiminuir.append(criarIcone("fa-solid", "fa-minus"));
    btnAumentar.append(criarIcone("fa-solid", "fa-plus"));
    btnDeletar.append(criarIcone("fa-solid", "fa-trash"));

    btnDiminuir.addEventListener("click", () => alterarQuantidadeCarrinho(item.nomeProduto, -1));
    btnAumentar.addEventListener("click", () => alterarQuantidadeCarrinho(item.nomeProduto, 1));
    btnDeletar.addEventListener("click", () => deletarItemCarrinho(item.nomeProduto));

    divControlesQtd.append(btnDiminuir, spanQtd, btnAumentar);
    divDetalhes.append(h4Nome, pPreco, divControlesQtd);
    divInfo.append(imgProduto, divDetalhes);

    liProduto.append(divInfo, btnDeletar);
    listaDestino.append(liProduto);
}

function alternarCarrinhoLateral(abrir) {
    const carrinhoLateral = document.getElementById("carrinho_lateral");
    const fundoModal = document.getElementById("fundo_modal");
    const botaoCarrinho = document.getElementById("botao_carrinho");

    carrinhoLateral.classList.toggle("aberto", abrir);
    carrinhoLateral.setAttribute("aria-hidden", !abrir);
    botaoCarrinho.setAttribute("aria-expanded", abrir);
    fundoModal.hidden = !abrir;
    document.body.classList.toggle("modal-aberto", abrir);
}

// TEMA CLARO / ESCURO
function aplicarTema(tema) {
    document.documentElement.dataset.tema = tema;
    const iconeTema = document.getElementById("icone_tema");

    if (tema === "escuro") {
        iconeTema.classList.remove("fa-moon");
        iconeTema.classList.add("fa-sun");
    } else {
        iconeTema.classList.remove("fa-sun");
        iconeTema.classList.add("fa-moon");
    }
}

// NEWSLETTER
function iniciarNewsletter() {
    const formulario = document.getElementById("form_newsletter");
    const inputEmail = document.getElementById("email_newsletter");
    const textoErro = document.getElementById("erro_newsletter");

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const email = inputEmail.value.trim();

        if (!emailValido(email)) {
            textoErro.textContent = "Digite um e-mail válido, por exemplo: nome@email.com";
            inputEmail.setAttribute("aria-invalid", "true");
            inputEmail.focus();
            return;
        }

        textoErro.textContent = "";
        inputEmail.removeAttribute("aria-invalid");
        formulario.reset();
        mostrarAviso("Inscrição confirmada! Fique de olho nas ofertas.");
    });
}

function iniciarTema() {
    const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const temaSalvo = localStorage.getItem(CHAVE_TEMA) || (prefereEscuro ? "escuro" : "claro");
    aplicarTema(temaSalvo);

    document.getElementById("botao_tema").addEventListener("click", () => {
        const temaAtual = document.documentElement.dataset.tema;
        const novoTema = temaAtual === "escuro" ? "claro" : "escuro";
        localStorage.setItem(CHAVE_TEMA, novoTema);
        aplicarTema(novoTema);
    });
}

function iniciarEventos() {
    const inputPesquisa = document.getElementById("barra_pesquisa");
    inputPesquisa.addEventListener("input", () => {
        termoBusca = inputPesquisa.value;
        filtrarEOrdenarProdutos();
    });

    const botoesCategoria = document.querySelectorAll("#menu_categorias button");
    botoesCategoria.forEach((botao) => {
        botao.addEventListener("click", () => {
            botoesCategoria.forEach((b) => {
                b.classList.remove("ativo");
                b.setAttribute("aria-pressed", "false");
            });
            botao.classList.add("ativo");
            botao.setAttribute("aria-pressed", "true");
            categoriaSelecionada = botao.dataset.categoria;
            filtrarEOrdenarProdutos();
        });
    });

    const selectOrdem = document.getElementById("select_ordem");
    selectOrdem.addEventListener("change", () => {
        ordemSelecionada = selectOrdem.value;
        filtrarEOrdenarProdutos();
    });

    document.getElementById("botao_carrinho").addEventListener("click", () => alternarCarrinhoLateral(true));
    document.getElementById("botao_fechar_carrinho").addEventListener("click", () => alternarCarrinhoLateral(false));
    document.getElementById("fundo_modal").addEventListener("click", () => alternarCarrinhoLateral(false));

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            alternarCarrinhoLateral(false);
        }
    });

    document.getElementById("botao_finalizar").addEventListener("click", () => {
        const carrinho = getCarrinho();
        if (carrinho.length === 0) return;

        const resumo = calcularResumoCarrinho(carrinho);
        mostrarAviso(`Pedido confirmado! Total: ${formatarMoeda(resumo.total)}`);
        setCarrinho([]);
        atualizarTelaCarrinho();
        alternarCarrinhoLateral(false);
    });
}

iniciarTema();
iniciarEventos();
iniciarNewsletter();
filtrarEOrdenarProdutos();
atualizarTelaCarrinho();
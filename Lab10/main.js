const apiBase = "https://deisishop.pythonanywhere.com/";
const productsUrl = `${apiBase}products/`;
const categoriesUrl = `${apiBase}categories/`;

// Inicializar o localStorage com a chave "produtos-selecionados"
if (!localStorage.getItem('produtos-selecionados')) {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

if (!localStorage.getItem('referencia-pagamento')) {
    localStorage.setItem('referencia-pagamento', '201124-0004'); // Inicializa com o valor inicial
}

// Função para buscar categorias e popular o filtro
async function fetchCategories() {
    try {
        const response = await fetch(categoriesUrl);
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        const categories = await response.json();
        renderCategoryFilter(categories);
    } catch (error) {
        console.error("Erro ao obter categorias:", error);
    }
}

// Função para buscar produtos e renderizar na página
async function fetchProducts(category = "all", order = "asc", search = "") {
    try {
        const response = await fetch(productsUrl);
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        let products = await response.json();

        // Filtrar por categoria
        if (category !== "all") {
            products = products.filter(product => product.category === category);
        }

        // Filtrar por pesquisa (case-insensitive)
        if (search) {
            products = products.filter(product =>
                product.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Ordenar por preço
        products.sort((a, b) => (order === "asc" ? a.price - b.price : b.price - a.price));

        renderProducts(products);
    } catch (error) {
        console.error("Erro ao obter produtos:", error);
    }
}

// Função para renderizar as categorias
function renderCategoryFilter(categories) {
    const categoryFilter = document.getElementById("category-filter");
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    categoryFilter.addEventListener("change", applyFilters);
}

// Função para aplicar os filtros
function applyFilters() {
    const selectedCategory = document.getElementById("category-filter").value;
    const selectedOrder = document.getElementById("price-filter").value;
    const searchText = document.getElementById("search-bar").value;
    fetchProducts(selectedCategory, selectedOrder, searchText);
}

// Função para renderizar os produtos
function renderProducts(products) {
    const productContainer = document.getElementById("produtos-container");
    productContainer.innerHTML = "";

    if (products.length === 0) {
        productContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("produto");
        productElement.innerHTML = 
            `<h3 class="produto-title">${product.title}</h3>
            <img src="${product.image}" alt="${product.title}">
            <p class="produto-price">€${product.price.toFixed(2)}</p>`;

        const botaoAdicionar = document.createElement('button');
        botaoAdicionar.textContent = '+ Adicionar ao cesto';
        botaoAdicionar.addEventListener('click', () => {
            adicionarProdutoAoCesto(product);
        });

        productElement.appendChild(botaoAdicionar);
        productContainer.appendChild(productElement);
    });
}

// Função para adicionar um produto ao carrinho no localStorage
function adicionarProdutoAoCesto(produto) {
    const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];

    const produtoExistente = produtosSelecionados.find(item => item.id === produto.id);

    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        produto.quantidade = 1;
        produtosSelecionados.push(produto);
    }

    localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
    atualizaCesto(); 
    atualizaPrecoTotal(); 
}

// Função para remover um produto do carrinho
function removerProdutoDoCesto(produtoId) {
    let produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];

    const produtoExistente = produtosSelecionados.find(item => item.id === produtoId);

    if (produtoExistente) {
        produtoExistente.quantidade -= 1;

        if (produtoExistente.quantidade <= 0) {
            produtosSelecionados = produtosSelecionados.filter(item => item.id !== produtoId);
        }
    }

    localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
    atualizaCesto(); 
    atualizaPrecoTotal(); 
}

// Função para atualizar o cesto no DOM
function atualizaCesto() {
    const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    const cestoContainer = document.getElementById('produtos-carrinho');
    cestoContainer.innerHTML = '';

    produtosSelecionados.forEach(produto => {
        const artigo = document.createElement('article');
        artigo.classList.add('produto-carrinho');
        artigo.innerHTML = 
            `<img src="${produto.image}" alt="${produto.title}">
            <h3>${produto.title}</h3>
            <p>Preço: €${produto.price.toFixed(2)}</p>
            <p>Quantidade: ${produto.quantidade}</p>`;

        const botaoRemover = document.createElement('button');
        botaoRemover.textContent = 'Remover';
        botaoRemover.addEventListener('click', () => {
            removerProdutoDoCesto(produto.id);
        });

        artigo.appendChild(botaoRemover);
        cestoContainer.appendChild(artigo);
    });

    atualizaPrecoTotal(); 
}

// Função para calcular e atualizar o preço total
function atualizaPrecoTotal() {
    const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    const precoTotalElement = document.getElementById('preco-total');
    const valorAPagarElement = document.getElementById('valor-a-pagar');

    // Calcula o preço bruto (sem descontos)
    let precoBruto = produtosSelecionados.reduce((total, produto) => total + produto.price * produto.quantidade, 0);

    // Aplica descontos
    let precoFinal = precoBruto;
    const isStudent = document.getElementById('student') ? document.getElementById('student').checked : false;
    if (isStudent) {
        precoFinal *= 0.9; // 10% de desconto para estudantes
    }

    const couponCode = document.getElementById('coupon-code') ? document.getElementById('coupon-code').value : '';
    if (couponCode === 'DESCONTO10') {
        precoFinal *= 0.9; // 10% de desconto com cupão
    }

    // Atualiza os elementos no DOM
    precoTotalElement.textContent = `Preço Total (sem descontos): €${precoBruto.toFixed(2)}`;
    valorAPagarElement.textContent = `Valor a pagar (com descontos): €${precoFinal.toFixed(2)}`;
    valorAPagarElement.style.display = 'block';
}

// Função para finalizar compra
document.getElementById('finalizar-compra').addEventListener('click', () => {
    let referenciaPagamento = localStorage.getItem('referencia-pagamento');
    if (!referenciaPagamento) {
        referenciaPagamento = '201124-0004';
    }

    const referenciaParts = referenciaPagamento.split('-');
    let numeroReferencia = parseInt(referenciaParts[1], 10);
    numeroReferencia += 1;

    referenciaPagamento = `${referenciaParts[0]}-${String(numeroReferencia).padStart(4, '0')}`;
    localStorage.setItem('referencia-pagamento', referenciaPagamento);

    const referenciaPagamentoElement = document.getElementById('referencia-pagamento');
    referenciaPagamentoElement.textContent = `Referência de pagamento: ${referenciaPagamento}`;
    referenciaPagamentoElement.style.display = 'block';
});

// Função para limpar carrinho
document.getElementById('limpar-carrinho').addEventListener('click', () => {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
    atualizaCesto();

    document.getElementById('coupon-code').value = '';
    document.getElementById('student').checked = false;

    const referenciaPagamentoElement = document.getElementById('referencia-pagamento');
    referenciaPagamentoElement.style.display = 'none';
    referenciaPagamentoElement.textContent = '';

    atualizaPrecoTotal();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('referencia-pagamento').style.display = 'none'; 
    document.getElementById('valor-a-pagar').style.display = 'none'; 

    fetchCategories();
    fetchProducts();
});

// Eventos de filtro
document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("price-filter").addEventListener("change", applyFilters);
document.getElementById('student').addEventListener('change', atualizaPrecoTotal);
document.getElementById('coupon-code').addEventListener('input', atualizaPrecoTotal);

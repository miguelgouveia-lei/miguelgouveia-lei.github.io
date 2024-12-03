const apiBase = "https://deisishop.pythonanywhere.com/";
const productsUrl = `${apiBase}products/`;
const categoriesUrl = `${apiBase}categories/`;
const buyUrl = `${apiBase}buy/`;

if (!localStorage.getItem('produtos-selecionados')) {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

if (!localStorage.getItem('referencia-pagamento')) {
    localStorage.setItem('referencia-pagamento', '201124-0004');
}

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

async function fetchProducts(category = "all", order = "asc", search = "") {
    try {
        const response = await fetch(productsUrl);
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        let products = await response.json();

        if (category !== "all") {
            products = products.filter(product => product.category === category);
        }

        if (search) {
            products = products.filter(product =>
                product.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        products.sort((a, b) => (order === "asc" ? a.price - b.price : b.price - a.price));

        renderProducts(products);
    } catch (error) {
        console.error("Erro ao obter produtos:", error);
    }
}

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

function applyFilters() {
    const selectedCategory = document.getElementById("category-filter").value;
    const selectedOrder = document.getElementById("price-filter").value;
    const searchText = document.getElementById("search-bar").value;
    fetchProducts(selectedCategory, selectedOrder, searchText);
}

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
             <p class="produto-description">€${product.description}</p>
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
}

async function calcularCompraAPI(produtos, isStudent, couponCode) {
    try {
        const response = await fetch(buyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                products: produtos,
                student: isStudent,
                coupon: couponCode,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro desconhecido: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Erro ao calcular compra: ${error.message}`);
        return { totalCost: null, reference: null, error: error.message };
    }
}

async function atualizaPrecoTotal() {
    const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
    const precoTotalElement = document.getElementById('preco-total');
    const valorAPagarElement = document.getElementById('valor-a-pagar');

    if (produtosSelecionados.length === 0) {
        precoTotalElement.textContent = `Preço Total: €0.00`;
        valorAPagarElement.style.display = 'none';
        return;
    }

    const productIds = produtosSelecionados.map(produto => produto.id);
    const isStudent = document.getElementById('student') ? document.getElementById('student').checked : false;
    const couponCode = document.getElementById('coupon-code') ? document.getElementById('coupon-code').value : '';

    const apiResponse = await calcularCompraAPI(productIds, isStudent, couponCode);

    if (apiResponse.error) {
        precoTotalElement.textContent = `Erro: ${apiResponse.error}`;
        valorAPagarElement.style.display = 'none';
        return;
    }

    precoTotalElement.textContent = `Preço Total (sem descontos): €${produtosSelecionados.reduce(
        (total, produto) => total + produto.price * produto.quantidade,
        0
    ).toFixed(2)}`;

    if (isStudent || couponCode) {
        valorAPagarElement.textContent = `Valor a pagar (com descontos): €${apiResponse.totalCost}`;
        valorAPagarElement.style.display = 'block';
    } else {
        valorAPagarElement.style.display = 'none';
    }
}

function finalizarCompra() {
    let referenciaPagamento = localStorage.getItem('referencia-pagamento');
    const referenciaPagamentoElement = document.getElementById('referencia-pagamento');

    if (!referenciaPagamento) referenciaPagamento = '201124-0004';

    const referenciaParts = referenciaPagamento.split('-');
    let numeroReferencia = parseInt(referenciaParts[1], 10);
    numeroReferencia += 1;

    referenciaPagamento = `${referenciaParts[0]}-${String(numeroReferencia).padStart(4, '0')}`;
    localStorage.setItem('referencia-pagamento', referenciaPagamento);

    referenciaPagamentoElement.textContent = `Referência de pagamento: ${referenciaPagamento}`;
    referenciaPagamentoElement.style.display = 'block';
}

function limparCarrinho() {
    localStorage.setItem('produtos-selecionados', JSON.stringify([]));
    document.getElementById('coupon-code').value = '';
    document.getElementById('student').checked = false;
    document.getElementById('referencia-pagamento').style.display = 'none';
    atualizaCesto();
    atualizaPrecoTotal();
}

document.getElementById('finalizar-compra').addEventListener('click', finalizarCompra);
document.getElementById('limpar-carrinho').addEventListener('click', limparCarrinho);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('referencia-pagamento').style.display = 'none';
    document.getElementById('valor-a-pagar').style.display = 'none';
    fetchCategories();
    fetchProducts();
});

document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("price-filter").addEventListener("change", applyFilters);
document.getElementById('student').addEventListener('change', atualizaPrecoTotal);
document.getElementById('coupon-code').addEventListener('input', atualizaPrecoTotal);

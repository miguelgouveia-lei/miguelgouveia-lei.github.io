// URLs base da API
const apiBase = "https://deisishop.pythonanywhere.com/";
const productsUrl = `${apiBase}products/`;
const categoriesUrl = `${apiBase}categories/`;

// Função para buscar categorias e popular o filtro no <select>
async function fetchCategories() {
    try {
        const response = await fetch(categoriesUrl);
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        const categories = await response.json();
        console.log("Categorias recebidas:", categories);  // Para depuração
        renderCategoryFilter(categories);
    } catch (error) {
        console.error("Erro ao obter categorias:", error);
    }
}

// Função para buscar produtos e renderizar na página
async function fetchProducts(category = "all") {
    try {
        const response = await fetch(productsUrl);
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        const products = await response.json();
        console.log("Produtos recebidos:", products);  // Para depuração

        // Filtra produtos pela categoria (se necessário)
        const filteredProducts = category === "all"
            ? products
            : products.filter(product => product.category === category);

        renderProducts(filteredProducts);
    } catch (error) {
        console.error("Erro ao obter produtos:", error);
    }
}

// Função para renderizar o filtro de categorias no <select>
function renderCategoryFilter(categories) {
    const categoryFilter = document.getElementById("category-filter");
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;  // Categoria como string
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Adiciona evento para filtrar produtos ao mudar a categoria
    categoryFilter.addEventListener("change", (e) => {
        const selectedCategory = e.target.value;
        fetchProducts(selectedCategory);  // Chama para filtrar os produtos
    });
}

// Função para renderizar os produtos na página
function renderProducts(products) {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = ""; // Limpa os produtos exibidos

    if (products.length === 0) {
        productContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <img src="${product.image}" alt="${product.title}" />
            <p>${product.description}</p>
            <p><strong>Preço:</strong> €${product.price.toFixed(2)}</p>
            <p><strong>Classificação:</strong> ${product.rating.rate} (${product.rating.count} avaliações)</p>
        `;
        productContainer.appendChild(productElement);
    });
}

// Inicialização da aplicação
function init() {
    fetchCategories(); // Carrega categorias para o filtro
    fetchProducts();   // Carrega todos os produtos inicialmente
}

// Chamada da função principal
init();

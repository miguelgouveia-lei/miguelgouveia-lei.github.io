// Inicializar o localStorage com a chave "produtos-selecionados"
if (!localStorage.getItem('produtos-selecionados')) {
  localStorage.setItem('produtos-selecionados', JSON.stringify([]));
}

// Função para criar o elemento HTML de um produto
function criarProduto(produto) {
  const produtoElement = document.createElement('div');
  produtoElement.classList.add('produto');

  produtoElement.innerHTML = `
      <img src="${produto.image}" alt="${produto.title}">
      <h2 class="produto-title">${produto.title}</h2>
      <p class="produto-price">Preço: €${produto.price.toFixed(2)}</p>
      <p class="produto-description">${produto.description}</p>
      <p class="produto-rating">Avaliação: ${produto.rating.rate} (${produto.rating.count} avaliações)</p>
  `;

  // Criar botão "+ Adicionar ao cesto"
  const botaoAdicionar = document.createElement('button');
  botaoAdicionar.textContent = '+ Adicionar ao cesto';

  // Adicionar o eventListener para o botão
  botaoAdicionar.addEventListener('click', () => {
      adicionarProdutoAoCesto(produto);
  });

  // Adicionar o botão ao elemento do produto
  produtoElement.appendChild(botaoAdicionar);
  return produtoElement;
}

// Função para adicionar um produto ao carrinho no localStorage
function adicionarProdutoAoCesto(produto) {
  // Obter a lista atual de produtos no carrinho
  const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];

  // Adicionar o produto ao carrinho
  produtosSelecionados.push(produto);

  // Atualizar o localStorage com o novo carrinho
  localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));

  console.log(`Produto "${produto.title}" adicionado ao cesto!`);

  // Atualizar o cesto no DOM
  atualizaCesto();
}

// Função para atualizar o cesto no DOM
function atualizaCesto() {
  const produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];
  const cestoContainer = document.getElementById('produtos-carrinho');
  cestoContainer.innerHTML = ''; // Limpar cesto antes de atualizar

  // Criar cada produto no cesto
  produtosSelecionados.forEach(produto => {
      const produtoCesto = criaProdutoCesto(produto);
      cestoContainer.appendChild(produtoCesto);
  });

  // Atualizar o preço total
  atualizaPrecoTotal(produtosSelecionados);
}

// Função para criar um elemento de produto no cesto
function criaProdutoCesto(produto) {
  const artigo = document.createElement('article');
  artigo.classList.add('produto-carrinho');

  artigo.innerHTML = `
      <h3>${produto.title}</h3>
      <p>Preço: €${produto.price.toFixed(2)}</p>
  `;

  // Botão para remover o produto
  const botaoRemover = document.createElement('button');
  botaoRemover.textContent = 'Remover';

  // Adicionar eventListener ao botão de remoção
  botaoRemover.addEventListener('click', () => {
      removerProdutoDoCesto(produto.id);
  });

  artigo.appendChild(botaoRemover);
  return artigo;
}

// Função para remover um produto do cesto
function removerProdutoDoCesto(produtoId) {
  let produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados')) || [];

  // Remover o produto com o ID correspondente
  produtosSelecionados = produtosSelecionados.filter(produto => produto.id !== produtoId);

  // Atualizar o localStorage com a nova lista
  localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));

  console.log(`Produto com ID "${produtoId}" removido do cesto.`);

  // Atualizar o cesto no DOM
  atualizaCesto();
}

// Função para calcular e exibir o preço total dos produtos no cesto
function atualizaPrecoTotal(produtos) {
  const precoTotal = produtos.reduce((total, produto) => total + produto.price, 0);
  const totalElement = document.getElementById('preco-total');

  // Atualizar ou criar o elemento de preço total
  if (!totalElement) {
      const novoTotalElement = document.createElement('p');
      novoTotalElement.id = 'preco-total';
      novoTotalElement.textContent = `Preço Total: €${precoTotal.toFixed(2)}`;
      document.getElementById('produtos-carrinho').appendChild(novoTotalElement);
  } else {
      totalElement.textContent = `Preço Total: €${precoTotal.toFixed(2)}`;
  }
}

// Função para renderizar todos os produtos na página
function renderizarProdutos() {
  const container = document.getElementById('produtos-container');

  // Limpar o container antes de renderizar (opcional)
  container.innerHTML = '';

  // Criar e adicionar cada produto ao container
  produtos.forEach(produto => {
      const produtoElement = criarProduto(produto);
      container.appendChild(produtoElement);
  });
}

// Inicializar a renderização dos produtos e do cesto
renderizarProdutos();
atualizaCesto();

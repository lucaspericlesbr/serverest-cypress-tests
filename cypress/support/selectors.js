const sel = {
  login: {
    email: '[data-testid="email"]',
    password: '[data-testid="senha"]',
    submit: '[data-testid="entrar"]',
    errorAlert: '.alert.alert-secondary',
  },
  register: {
    name: '[data-testid="nome"]',
    email: '[data-testid="email"]',
    password: '[data-testid="password"]',
    adminCheckbox: '[data-testid="checkbox"]',
    submit: '[data-testid="cadastrar"]',
    successAlert: '.alert.alert-primary',
    errorAlert: '.alert.alert-secondary',
  },
  home: {
    logout: '[data-testid="logout"]',
    searchInput: '[data-testid="pesquisar"]',
    searchButton: '[data-testid="botaoPesquisar"]',
    productCard: '.card.col-3',
    addToListButton: '[data-testid="adicionarNaLista"]',
  },
  list: {
    productItem: '[data-testid="shopping-cart-product-name"]',
    productQuantity: '[data-testid="shopping-cart-product-quantity"]',
    increaseQuantity: '[data-testid="product-increase-quantity"]',
    decreaseQuantity: '[data-testid="product-decrease-quantity"]',
    clearList: '[data-testid="limparLista"]',
    emptyMessage: '[data-testid="shopping-cart-empty-message"]',
  },
};

export default sel;

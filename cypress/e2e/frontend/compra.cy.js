import HomePage from '../../pages/HomePage';
import ListPage from '../../pages/ListPage';
import { buildUser, buildAdmin } from '../../support/factories/userFactory';
import { buildProduct } from '../../support/factories/productFactory';
import messages from '../../fixtures/messages.json';

describe('Frontend | Fluxo de compra', () => {
  let usuario;
  let token;
  let produto;

  before(() => {
    // 1. Cria um admin via API (necessário para cadastrar produtos)
    const admin = buildAdmin();
    cy.apiCreateUser(admin).its('status').should('eq', 201);

    // 2. Login admin via API → obtém o token Bearer
    cy.apiLogin(admin.email, admin.password).then((adminToken) => {
      // 3. Cria um produto único via API → testes não dependem do estado do banco
      produto = buildProduct();
      cy.apiCreateProduct(adminToken, produto).its('status').should('eq', 201);
    });

    // 4. Cria o usuário regular que será usado pelos testes (login via UI)
    usuario = buildUser();
    cy.apiCreateUser(usuario).its('status').should('eq', 201);
    cy.apiLogin(usuario.email, usuario.password).then((auth) => {
      token = auth;
    });
  });

  beforeEach(() => {
    // Garante que cada teste começa com a lista de compras vazia.
    cy.apiClearCart(token);
    cy.login(usuario.email, usuario.password);
    HomePage.visit();
  });

  context('Estado inicial da Lista de Compras', () => {
    it('deve exibir mensagem de lista vazia quando nenhum produto foi adicionado', () => {
      cy.visit('/minhaListaDeProdutos');

      ListPage.expectUrlIsList();
      cy.contains(messages.listEmpty).should('be.visible');
    });
  });

  context('Buscar produtos', () => {
    it('deve buscar um produto e exibir resultados correspondentes', () => {
      HomePage.expectUrlIsHome().search(produto.nome);
      HomePage.expectAtLeastOneProduct();
    });

    it('deve exibir nenhum resultado ao buscar por termo inexistente', () => {
      const termoInexistente = `produto-inexistente-${Date.now()}`;

      HomePage.search(termoInexistente);

      HomePage.expectNoResults();
    });
  });

  context('Adicionar produto à Lista de Compras', () => {
    it('deve adicionar o produto pesquisado à lista e validar a presença', () => {
      HomePage.search(produto.nome);
      HomePage.expectAtLeastOneProduct();
      HomePage.addFirstProductToList();

      ListPage.expectUrlIsList().expectProductInList(produto.nome);
    });

    it('deve agrupar quantidades ao adicionar o mesmo produto duas vezes', () => {
      // 1ª adição → vai para a lista
      HomePage.search(produto.nome);
      HomePage.addFirstProductToList();
      ListPage.expectUrlIsList();

      // Volta para home e adiciona o mesmo produto novamente
      HomePage.visit().search(produto.nome);
      HomePage.addFirstProductToList();
      ListPage.expectUrlIsList();

      // Espera-se 1 item agrupado com quantidade 2
      ListPage.expectItemsCount(1).expectProductInList(produto.nome).expectProductQuantity(2);
    });
  });

  context('Manipular quantidades na Lista de Compras', () => {
    beforeEach(() => {
      // Setup: adiciona um produto à lista antes de cada teste
      HomePage.search(produto.nome);
      HomePage.addFirstProductToList();
      ListPage.expectUrlIsList();
    });

    it('deve aumentar a quantidade do produto ao clicar no botão de incremento', () => {
      ListPage.increaseQuantity().expectProductQuantity(2);
    });

    it('deve diminuir a quantidade do produto ao clicar no botão de decremento', () => {
      ListPage.increaseQuantity().expectProductQuantity(2);
      ListPage.decreaseQuantity().expectProductQuantity(1);
    });
  });

  context('Limpar Lista de Compras', () => {
    it('deve esvaziar a lista ao acionar a limpeza', () => {
      HomePage.search(produto.nome);
      HomePage.addFirstProductToList();
      ListPage.expectUrlIsList();

      ListPage.clearList();

      ListPage.expectEmpty();
    });
  });
});

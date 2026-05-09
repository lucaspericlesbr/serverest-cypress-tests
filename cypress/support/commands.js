import sel from './selectors';

/**
 * Login via UI com cache de sessão (cy.session).
 * Reutiliza cookies/localStorage entre testes que usam o mesmo usuário,
 * evitando ter que repetir o fluxo de login a cada teste.
 */
Cypress.Commands.add('login', (email, password) => {
  cy.session(
    [email, password],
    () => {
      cy.visit('/login');
      cy.get(sel.login.email).type(email);
      cy.get(sel.login.password).type(password, { log: false });
      cy.get(sel.login.submit).click();
      cy.url().should('include', '/home');
    },
    {
      validate() {
        cy.visit('/home');
        cy.url().should('include', '/home');
      },
    },
  );
});

Cypress.Commands.add('apiCreateUser', (user) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/usuarios`,
    body: user,
  });
});

Cypress.Commands.add('apiDeleteUser', (id) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/usuarios/${id}`,
  });
});

/**
 * Login via API — retorna o token de autorização (Bearer).
 * Útil pra setup rápido de estado autenticado sem passar pela UI.
 */
Cypress.Commands.add('apiLogin', (email, password) => {
  return cy
    .request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/login`,
      body: { email, password },
    })
    .its('body.authorization');
});

/**
 * Cancela o carrinho do usuário autenticado (zera o estado da lista de compras).
 * `failOnStatusCode: false` porque a API responde 200 mesmo se não houver carrinho ativo.
 */
Cypress.Commands.add('apiClearCart', (token) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/carrinhos/cancelar-compra`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  });
});

/**
 * Cria um produto via API. Requer token de usuário com privilégios de admin.
 */
Cypress.Commands.add('apiCreateProduct', (token, product) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/produtos`,
    headers: { Authorization: token },
    body: product,
  });
});

/**
 * Deleta um produto via API. Requer token de admin.
 */
Cypress.Commands.add('apiDeleteProduct', (token, id) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/produtos/${id}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  });
});

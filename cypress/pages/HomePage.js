import sel from '../support/selectors';

class HomePage {
  visit() {
    cy.visit('/home');
    return this;
  }

  search(term) {
    cy.get(sel.home.searchInput).clear();
    cy.get(sel.home.searchInput).type(term);
    cy.get(sel.home.searchButton).click();
    return this;
  }

  addFirstProductToList() {
    cy.get(sel.home.addToListButton).first().click();
    return this;
  }

  expectAtLeastOneProduct() {
    cy.get(sel.home.productCard).should('have.length.greaterThan', 0);
    return this;
  }

  expectNoResults() {
    cy.get(sel.home.productCard).should('have.length', 0);
    return this;
  }

  expectUrlIsHome() {
    cy.url().should('include', '/home');
    return this;
  }

  /**
   * Valida que o usuário está autenticado e na home:
   * URL correta + título da loja + botão de logout visível.
   */
  expectLogged() {
    cy.url({ timeout: 10000 }).should('include', '/home');
    cy.contains('Serverest Store').should('be.visible');
    cy.get(sel.home.logout).should('be.visible');
    return this;
  }
}

export default new HomePage();

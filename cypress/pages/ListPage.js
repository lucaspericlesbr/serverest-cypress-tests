import sel from '../support/selectors';

class ListPage {
  expectUrlIsList() {
    cy.url().should('include', '/minhaListaDeProdutos');
    return this;
  }

  expectProductInList(productName) {
    cy.get(sel.list.productItem).should('contain.text', productName);
    return this;
  }

  expectItemsCount(count) {
    cy.get(sel.list.productItem).should('have.length', count);
    return this;
  }

  expectEmpty() {
    cy.get(sel.list.emptyMessage)
      .should('be.visible')
      .and('contain.text', 'Seu carrinho está vazio');
    return this;
  }

  expectProductQuantity(expectedQuantity) {
    cy.get(sel.list.productQuantity).should('contain.text', expectedQuantity);
    return this;
  }

  increaseQuantity() {
    cy.get(sel.list.increaseQuantity).first().click();
    return this;
  }

  decreaseQuantity() {
    cy.get(sel.list.decreaseQuantity).first().click();
    return this;
  }

  clearList() {
    cy.get(sel.list.clearList).click();
    return this;
  }
}

export default new ListPage();

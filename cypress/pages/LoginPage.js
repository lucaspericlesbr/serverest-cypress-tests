import sel from '../support/selectors';

class LoginPage {
  visit() {
    cy.visit('/login');
    return this;
  }

  fillEmail(email) {
    cy.get(sel.login.email).clear();
    cy.get(sel.login.email).type(email);
    return this;
  }

  fillPassword(password) {
    cy.get(sel.login.password).clear();
    cy.get(sel.login.password).type(password, { log: false });
    return this;
  }

  submit() {
    cy.get(sel.login.submit).click();
    return this;
  }

  loginAs(email, password) {
    return this.fillEmail(email).fillPassword(password).submit();
  }

  expectErrorMessageContaining(message) {
    cy.get(sel.login.errorAlert).should('be.visible').and('contain.text', message);
    return this;
  }

  expectStillOnLogin() {
    cy.url().should('include', '/login');
    return this;
  }
}

export default new LoginPage();

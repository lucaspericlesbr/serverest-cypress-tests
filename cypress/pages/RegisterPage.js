import sel from '../support/selectors';

class RegisterPage {
  visit() {
    cy.visit('/cadastrarusuarios');
    return this;
  }

  fillName(name) {
    cy.get(sel.register.name).clear();
    cy.get(sel.register.name).type(name);
    return this;
  }

  fillEmail(email) {
    cy.get(sel.register.email).clear();
    cy.get(sel.register.email).type(email);
    return this;
  }

  fillPassword(password) {
    cy.get(sel.register.password).clear();
    cy.get(sel.register.password).type(password, { log: false });
    return this;
  }

  toggleAdmin() {
    cy.get(sel.register.adminCheckbox).check();
    return this;
  }

  submit() {
    cy.get(sel.register.submit).click();
    return this;
  }

  registerUser({ nome, email, password, administrador = false }) {
    this.fillName(nome).fillEmail(email).fillPassword(password);
    if (administrador) this.toggleAdmin();
    return this.submit();
  }

  /**
   * Preenche apenas os campos fornecidos. Campos undefined/vazios
   */
  fillForm({ nome, email, password, administrador = false } = {}) {
    if (nome) this.fillName(nome);
    if (email) this.fillEmail(email);
    if (password) this.fillPassword(password);
    if (administrador) this.toggleAdmin();
    return this;
  }

  expectSuccessMessage(message = 'Cadastro realizado com sucesso') {
    cy.get(sel.register.successAlert).should('be.visible').and('contain.text', message);
    return this;
  }

  expectErrorMessageContaining(message) {
    cy.get(sel.register.errorAlert).should('be.visible').and('contain.text', message);
    return this;
  }
}

export default new RegisterPage();

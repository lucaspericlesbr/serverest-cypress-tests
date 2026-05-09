import LoginPage from '../../pages/LoginPage';
import HomePage from '../../pages/HomePage';
import { buildUser } from '../../support/factories/userFactory';
import messages from '../../fixtures/messages.json';

describe('Frontend | Login', () => {
  context('Quando o usuário usa credenciais válidas', () => {
    let usuario;

    before(() => {
      usuario = buildUser();
      cy.apiCreateUser(usuario).its('status').should('eq', 201);
    });

    beforeEach(() => {
      LoginPage.visit();
    });

    it('deve realizar login com sucesso e redirecionar para a home', () => {
      LoginPage.loginAs(usuario.email, usuario.password);

      HomePage.expectLogged();
    });
  });

  context('Quando o usuário usa credenciais inválidas', () => {
    beforeEach(() => {
      LoginPage.visit();
    });

    it('deve exibir mensagem de erro ao tentar logar com email e senha inexistentes', () => {
      LoginPage.loginAs('naoexiste@qa.com', 'senhaErrada123');

      LoginPage.expectErrorMessageContaining(messages.loginInvalid);
      LoginPage.expectStillOnLogin();
    });

    it('deve manter o usuário na tela de login após múltiplas tentativas inválidas', () => {
      LoginPage.loginAs('errado1@qa.com', 'senha1');
      LoginPage.expectErrorMessageContaining(messages.loginInvalid);

      LoginPage.fillEmail('errado2@qa.com').fillPassword('senha2').submit();
      LoginPage.expectErrorMessageContaining(messages.loginInvalid);
      LoginPage.expectStillOnLogin();
    });
  });
});

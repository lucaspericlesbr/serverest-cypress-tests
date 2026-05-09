import { buildUser } from '../../support/factories/userFactory';

const apiUrl = () => Cypress.env('apiUrl');

describe('API | Login', () => {
  let usuario;
  let userId;

  before(() => {
    // Cria o usuário uma única vez — todos os testes deste spec o reusam
    usuario = buildUser();
    cy.apiCreateUser(usuario).then(({ body }) => {
      userId = body._id;
    });
  });

  after(() => {
    if (userId) cy.apiDeleteUser(userId);
  });

  context('Credenciais válidas', () => {
    it('deve autenticar e retornar token Bearer (200)', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl()}/login`,
        body: { email: usuario.email, password: usuario.password },
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.have.property('message', 'Login realizado com sucesso');
        expect(body).to.have.property('authorization').that.is.a('string').and.match(/^Bearer /);
      });
    });
  });

  context('Credenciais inválidas', () => {
    it('deve retornar 401 ao usar senha incorreta', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl()}/login`,
        body: { email: usuario.email, password: 'senhaIncorreta' },
        failOnStatusCode: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(401);
        expect(body).to.have.property('message', 'Email e/ou senha inválidos');
        expect(body).to.not.have.property('authorization');
      });
    });

    it('deve retornar 401 ao usar email inexistente', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl()}/login`,
        body: { email: 'naoexiste@qa.com', password: 'qualquer123' },
        failOnStatusCode: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(401);
        expect(body).to.have.property('message', 'Email e/ou senha inválidos');
      });
    });
  });

  context('Payload inválido', () => {
    it('deve retornar 400 ao enviar payload sem o campo email', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl()}/login`,
        body: { password: '123456' },
        failOnStatusCode: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body).to.have.property('email');
      });
    });
  });
});

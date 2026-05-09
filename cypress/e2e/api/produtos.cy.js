import { buildUser, buildAdmin } from '../../support/factories/userFactory';
import { buildProduct } from '../../support/factories/productFactory';

const apiUrl = () => Cypress.env('apiUrl');

describe('API | Produtos', () => {
  let admin;
  let regularUser;
  let adminToken;
  let userToken;
  let adminId;
  let userId;
  const produtosCriados = [];

  before(() => {
    // Cria admin + usuário regular e obtém os tokens de cada um
    admin = buildAdmin();
    cy.apiCreateUser(admin).then(({ body }) => {
      adminId = body._id;
    });
    cy.apiLogin(admin.email, admin.password).then((token) => {
      adminToken = token;
    });

    regularUser = buildUser();
    cy.apiCreateUser(regularUser).then(({ body }) => {
      userId = body._id;
    });
    cy.apiLogin(regularUser.email, regularUser.password).then((token) => {
      userToken = token;
    });
  });

  after(() => {
    // Cleanup: remove todos os produtos criados durante a suite
    produtosCriados.forEach((id) => cy.apiDeleteProduct(adminToken, id));
    if (adminId) cy.apiDeleteUser(adminId);
    if (userId) cy.apiDeleteUser(userId);
  });

  context('Cadastro de produto', () => {
    it('deve cadastrar um produto com token de admin (201)', () => {
      const produto = buildProduct();

      cy.apiCreateProduct(adminToken, produto).then(({ status, body }) => {
        expect(status).to.eq(201);
        expect(body).to.have.property('message', 'Cadastro realizado com sucesso');
        expect(body).to.have.property('_id').that.is.a('string').and.not.empty;

        produtosCriados.push(body._id);
      });
    });

    it('deve retornar 400 ao tentar cadastrar produto com nome duplicado', () => {
      const produto = buildProduct();

      // 1ª criação — sucesso
      cy.apiCreateProduct(adminToken, produto).then(({ body }) => {
        produtosCriados.push(body._id);
      });

      // 2ª criação com mesmo payload — deve falhar
      cy.request({
        method: 'POST',
        url: `${apiUrl()}/produtos`,
        headers: { Authorization: adminToken },
        body: produto,
        failOnStatusCode: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body).to.have.property('message', 'Já existe produto com esse nome');
      });
    });
  });

  context('Autenticação e autorização', () => {
    it('deve impedir cadastro de produto sem token de autenticação (401)', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl()}/produtos`,
        body: buildProduct(),
        failOnStatusCode: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(401);
        expect(body).to.have.property('message').that.includes('Token de acesso ausente');
      });
    });

    it('deve impedir cadastro de produto com token de usuário não-admin (403)', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl()}/produtos`,
        headers: { Authorization: userToken },
        body: buildProduct(),
        failOnStatusCode: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(403);
        expect(body).to.have.property('message').that.includes('administradores');
      });
    });
  });
});

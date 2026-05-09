import { buildUser } from '../../support/factories/userFactory';

const apiUrl = () => Cypress.env('apiUrl');

describe('API | Usuários', () => {
  context('POST /usuarios', () => {
    let usuario;
    let userId;

    beforeEach(() => {
      usuario = buildUser();
    });

    afterEach(() => {
      // Cleanup: remove o usuário criado para evitar poluir o banco de testes
      if (userId) {
        cy.apiDeleteUser(userId);
        userId = undefined;
      }
    });

    it('deve cadastrar um novo usuário com dados válidos (201)', () => {
      cy.apiCreateUser(usuario).then(({ status, body }) => {
        expect(status).to.eq(201);
        expect(body).to.have.property('message', 'Cadastro realizado com sucesso');
        expect(body).to.have.property('_id').that.is.a('string').and.not.empty;

        userId = body._id;
      });
    });

    it('deve retornar 400 ao tentar cadastrar um email já existente', () => {
      // Setup: cria o usuário primeiro
      cy.apiCreateUser(usuario).then(({ body }) => {
        userId = body._id;
      });

      // Tentativa de duplicação
      cy.request({
        method: 'POST',
        url: `${apiUrl()}/usuarios`,
        body: usuario,
        failOnStatusCode: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        expect(body).to.have.property('message', 'Este email já está sendo usado');
      });
    });

    it('deve retornar 400 ao enviar payload com campos obrigatórios faltando', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl()}/usuarios`,
        body: { email: 'apenas-email@qa.com' },
        failOnStatusCode: false,
      }).then(({ status, body }) => {
        expect(status).to.eq(400);
        // A API retorna mensagens específicas por campo ausente
        expect(body).to.have.any.keys('nome', 'password', 'administrador');
      });
    });
  });

  context('GET /usuarios/{id}', () => {
    let usuario;
    let userId;

    before(() => {
      usuario = buildUser();
      cy.apiCreateUser(usuario).then(({ body }) => {
        userId = body._id;
      });
    });

    after(() => {
      if (userId) cy.apiDeleteUser(userId);
    });

    it('deve retornar os dados do usuário criado (200)', () => {
      cy.request('GET', `${apiUrl()}/usuarios/${userId}`).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body).to.deep.include({
          _id: userId,
          nome: usuario.nome,
          email: usuario.email,
          password: usuario.password,
          administrador: usuario.administrador,
        });
      });
    });

    it('deve retornar 400 ao buscar um id de usuário previamente deletado', () => {
      // Cria + deleta um usuário
      const usuarioTemp = buildUser();
      cy.apiCreateUser(usuarioTemp).then(({ body }) => {
        const idDeletado = body._id;

        cy.apiDeleteUser(idDeletado).then(() => {
          cy.request({
            method: 'GET',
            url: `${apiUrl()}/usuarios/${idDeletado}`,
            failOnStatusCode: false,
          }).then(({ status, body: getBody }) => {
            expect(status).to.eq(400);
            expect(getBody).to.have.property('message', 'Usuário não encontrado');
          });
        });
      });
    });
  });
});

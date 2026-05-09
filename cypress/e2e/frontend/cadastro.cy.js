import RegisterPage from '../../pages/RegisterPage';
import { buildUser } from '../../support/factories/userFactory';
import messages from '../../fixtures/messages.json';

describe('Frontend | Cadastro de usuário', () => {
  context('Quando o usuário preenche dados válidos', () => {
    it('deve cadastrar um novo usuário e exibir mensagem de sucesso', () => {
      const novoUsuario = buildUser();

      RegisterPage.visit().registerUser({
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        password: novoUsuario.password,
      });

      RegisterPage.expectSuccessMessage(messages.registerSuccess);
      cy.url({ timeout: 10000 }).should((url) => {
        expect(url).to.match(/\/(home|admin\/home|cadastrarusuarios)/);
      });
    });
  });

  context('Quando o usuário tenta cadastrar com email já existente', () => {
    it('deve exibir mensagem de erro e permanecer na tela de cadastro', () => {
      const usuarioExistente = buildUser();

      cy.apiCreateUser(usuarioExistente).then((response) => {
        expect(response.status).to.eq(201);
      });

      RegisterPage.visit().registerUser({
        nome: usuarioExistente.nome,
        email: usuarioExistente.email,
        password: usuarioExistente.password,
      });

      RegisterPage.expectErrorMessageContaining(messages.registerEmailExists);
      cy.url().should('include', '/cadastrarusuarios');
    });
  });

  context('Quando o usuário deixa campos obrigatórios em branco', () => {
    /**
     * cada caso preenche todos os campos exceto um,
     */
    const camposObrigatorios = [
      {
        campo: 'nome',
        dados: () => {
          const u = buildUser();
          return { email: u.email, password: u.password };
        },
      },
      {
        campo: 'email',
        dados: () => {
          const u = buildUser();
          return { nome: u.nome, password: u.password };
        },
      },
      {
        campo: 'password',
        dados: () => {
          const u = buildUser();
          return { nome: u.nome, email: u.email };
        },
      },
    ];

    camposObrigatorios.forEach(({ campo, dados }) => {
      it(`não deve cadastrar quando o campo "${campo}" está vazio`, () => {
        RegisterPage.visit().fillForm(dados()).submit();

        // Form não submeteu → continua na tela de cadastro
        cy.url().should('include', '/cadastrarusuarios');
        // Nenhuma mensagem de sucesso apareceu
        cy.contains(messages.registerSuccess).should('not.exist');
      });
    });
  });
});

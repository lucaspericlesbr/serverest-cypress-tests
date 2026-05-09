# ServeRest — Testes E2E e API com Cypress

Suíte de testes automatizados para a aplicação [ServeRest](https://serverest.dev), cobrindo cenários de **Frontend (E2E)** e **API REST** com [Cypress](https://www.cypress.io/) e JavaScript.

> Projeto desenvolvido como parte de uma avaliação técnica de QA, com foco em boas práticas, padrões de projeto e qualidade de código.

---

## 📊 Status do projeto

| Suite        | Specs | Testes | Status   |
| ------------ | :---: | :----: | :------: |
| **Frontend** |   3   |   16   | ✅ 16/16 |
| **API**      |   3   |   13   | ✅ 13/13 |
| **Total**    | **6** | **29** | **✅ 29/29** |

Tempo médio de execução: **~1m12s** (modo headless).

---

## 🛠 Stack

| Tecnologia | Uso |
| --- | --- |
| **Cypress 15** | Framework de testes E2E e API |
| **JavaScript (ES Modules)** | Linguagem dos specs e suporte |
| **@faker-js/faker** | Geração de dados dinâmicos (usuários, produtos) |
| **cypress-plugin-api** | Visualização rica das requisições nos testes de API |
| **cypress-mochawesome-reporter** | Geração de relatório HTML após execução |
| **ESLint + Prettier + EditorConfig** | Padronização e qualidade de código |
| **cross-env** | Variáveis de ambiente cross-platform nos scripts |

---

## ✅ Pré-requisitos

- **Node.js** ≥ 18 (recomendado LTS — testado na v24)
- **npm** ≥ 9
- Sistema operacional Windows, Linux ou macOS

> **Windows:** caso o PowerShell bloqueie a execução do `npm` com erro de _execution policy_, rode uma vez:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

---

## 📦 Instalação

```bash
git clone https://github.com/lucaspericlesbr/serverest-cypress-tests.git
cd serverest-cypress-tests
npm install
```

A primeira instalação baixa o binário do Cypress (~300 MB). O cache fica em `./.cypress-cache/` (local ao projeto, fora do `AppData`) — isolado de antivírus e do escopo de outros projetos.

---

## ▶️ Executando os testes

| Script                  | O que faz                                                  |
| ----------------------- | ---------------------------------------------------------- |
| `npm run cy:open`       | Abre o Cypress em modo interativo (GUI)                    |
| `npm run cy:run`        | Executa **todos** os testes em modo headless               |
| `npm run test:frontend` | Executa apenas os specs de frontend (`cypress/e2e/frontend/`) |
| `npm run test:api`      | Executa apenas os specs de API (`cypress/e2e/api/`)        |
| `npm run report:open`   | Abre o relatório HTML mais recente no browser padrão       |
| `npm run lint`          | Roda ESLint sobre todo o código                            |
| `npm run lint:fix`      | Roda ESLint corrigindo o que for possível                  |
| `npm run format`        | Formata o código com Prettier                              |

### Exemplo de execução

```bash
$ npm run cy:run

  Frontend | Cadastro de usuário
    Quando o usuário preenche dados válidos
      ✓ deve cadastrar um novo usuário e exibir mensagem de sucesso
    ...

       Spec                                  Tests  Passing  Failing
  ┌────────────────────────────────────────────────────────────────┐
  │ ✓  api/login.cy.js                          4        4        - │
  │ ✓  api/produtos.cy.js                       4        4        - │
  │ ✓  api/usuarios.cy.js                       5        5        - │
  │ ✓  frontend/cadastro.cy.js                  5        5        - │
  │ ✓  frontend/compra.cy.js                    8        8        - │
  │ ✓  frontend/login.cy.js                     3        3        - │
  └────────────────────────────────────────────────────────────────┘
    ✓  All specs passed!                  01:11      29       29
```

---

## 📑 Relatório HTML

A cada execução, um relatório completo é gerado em `cypress/reports/index.html` com:

- 📈 Sumário com gráficos de pizza (passou/falhou/duração)
- 🗂 Detalhamento por spec e por teste
- 🖼 Screenshots embutidas dos testes que falharem
- 🎯 Filtros por status (Passed / Failed / Pending)

Como o relatório usa `inlineAssets: true` e `embeddedScreenshots: true`, **o `index.html` é autossuficiente** — pode ser compartilhado isoladamente por e-mail ou anexo, sem depender de pastas auxiliares.

<img width="1888" height="889" alt="gif-relatorio" src="https://github.com/user-attachments/assets/146850e2-4393-486c-b65b-563183256d9c" />



```bash
npm run cy:run        # gera o relatório
npm run report:open   # abre no navegador
```

---

## 🗂 Estrutura do projeto

```
serverest-cypress-tests/
├── cypress/
│   ├── e2e/
│   │   ├── frontend/                        # Testes E2E de UI (3 specs, 16 testes)
│   │   │   ├── cadastro.cy.js
│   │   │   ├── login.cy.js
│   │   │   └── compra.cy.js
│   │   └── api/                             # Testes de API (3 specs, 13 testes)
│   │       ├── usuarios.cy.js
│   │       ├── login.cy.js
│   │       └── produtos.cy.js
│   ├── fixtures/
│   │   └── messages.json                    # Mensagens esperadas (fonte única de verdade)
│   ├── pages/                               # Page Object Model
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── HomePage.js
│   │   └── ListPage.js
│   ├── reports/                             # (gerado) — relatórios HTML/JSON
│   └── support/
│       ├── commands.js                      # Custom commands (cy.login, cy.apiCreateUser, etc.)
│       ├── e2e.js                           # Setup global e plugins
│       ├── selectors.js                     # Mapa centralizado de seletores (data-testid)
│       └── factories/
│           ├── userFactory.js               # buildUser, buildAdmin
│           └── productFactory.js            # buildProduct
├── .editorconfig
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── cypress.config.js                        # baseUrl, env.apiUrl, retries, reporter
├── eslint.config.mjs                        # Flat config (ESLint 9+)
├── package.json
└── README.md
```

---

## 🧱 Padrões e boas práticas aplicados

### Padrões de projeto

| Padrão | Aplicação no projeto |
| --- | --- |
| **Page Object Model (POM)** | Cada página da aplicação é uma classe (`LoginPage`, `RegisterPage`, `HomePage`, `ListPage`) com método chaining (`return this`) |
| **Factory Pattern** | `userFactory.js` e `productFactory.js` produzem objetos de teste com Faker + overrides |
| **Custom Commands** | `cy.login` (com `cy.session` cacheado), `cy.apiCreateUser`, `cy.apiLogin`, `cy.apiClearCart`, `cy.apiCreateProduct`, etc. |
| **Selectors centralizados** | Todos os `data-testid` em `cypress/support/selectors.js` — uma alteração na app é refletida em 1 só lugar |
| **Fixtures como fonte única de verdade** | Mensagens esperadas em `cypress/fixtures/messages.json`, importadas pelos specs |

### Princípios de teste

- **API for setup, UI for assertion** — pré-condições (criar usuário, criar produto, autenticar) são preparadas via API; as asserções de comportamento são feitas pela UI. Resultado: testes mais rápidos e isolados.
- **Independência entre execuções** — cada execução gera dados únicos via Faker (incluindo timestamp no nome do produto), evitando colisões e tornando os testes idempotentes.
- **State isolation entre testes** — `cy.apiClearCart` é chamado em `beforeEach` no spec de compra para garantir carrinho vazio.
- **Data-driven tests** — validação de campos obrigatórios no cadastro varia em loop sobre uma estrutura de dados, evitando duplicação.
- **Testes negativos junto com positivos** — cada feature cobre o caminho feliz **e** os caminhos de erro.
- **Senhas nunca logadas** — `type(password, { log: false })` em todos os formulários e custom commands.

### Qualidade de código

- ESLint (flat config, ESLint 9+) com `eslint-plugin-cypress`
- Prettier para formatação consistente
- EditorConfig para uniformidade entre editores
- Zero código morto: cada seletor, cada método de Page Object e cada custom command é referenciado em algum lugar.

---

## 📋 Cenários implementados

### 🖥 Frontend — 16 testes em 3 specs

#### `cadastro.cy.js` — 5 testes

| # | Cenário | Tipo |
| - | --- | --- |
| 1 | Cadastra usuário com sucesso e exibe mensagem | Positivo |
| 2 | Bloqueia cadastro com email duplicado (setup via API) | Negativo |
| 3 | Bloqueia cadastro sem o campo `nome` | Negativo (data-driven) |
| 4 | Bloqueia cadastro sem o campo `email` | Negativo (data-driven) |
| 5 | Bloqueia cadastro sem o campo `password` | Negativo (data-driven) |

#### `login.cy.js` — 3 testes

| # | Cenário | Tipo |
| - | --- | --- |
| 1 | Login com sucesso redireciona para `/home` (valida URL, título e botão de logout) | Positivo |
| 2 | Login com credenciais inexistentes exibe mensagem de erro | Negativo |
| 3 | Múltiplas tentativas inválidas mantêm usuário em `/login` | Negativo |

#### `compra.cy.js` — 8 testes

| # | Cenário | Tipo |
| - | --- | --- |
| 1 | Lista vazia inicialmente exibe mensagem | Estado inicial |
| 2 | Busca por produto retorna resultados correspondentes | Positivo |
| 3 | Busca por termo inexistente não retorna nada | Negativo |
| 4 | Adiciona produto à lista e valida presença | Positivo |
| 5 | Adicionar mesmo produto 2x agrupa em quantidade 2 (não duplica linhas) | Regra de negócio |
| 6 | Botão `+` aumenta quantidade do produto na lista | Manipulação |
| 7 | Botão `−` diminui quantidade do produto na lista | Manipulação |
| 8 | Botão "Limpar Lista" esvazia o carrinho | Manipulação |

### 🌐 API — 13 testes em 3 specs

#### `api/usuarios.cy.js` — 5 testes (CRUD parcial)

| Endpoint | Cenário | Status esperado |
| --- | --- | --- |
| `POST /usuarios` | Cadastro com sucesso | 201 |
| `POST /usuarios` | Email duplicado | 400 |
| `POST /usuarios` | Payload com campos faltando | 400 |
| `GET /usuarios/{id}` | Busca usuário existente — valida payload | 200 |
| `GET /usuarios/{id}` | Busca id de usuário previamente deletado | 400 |

#### `api/login.cy.js` — 4 testes (autenticação)

| Endpoint | Cenário | Status esperado |
| --- | --- | --- |
| `POST /login` | Credenciais válidas — valida formato `Bearer ...` do token | 200 |
| `POST /login` | Senha incorreta | 401 |
| `POST /login` | Email inexistente | 401 |
| `POST /login` | Payload sem o campo email | 400 |

#### `api/produtos.cy.js` — 4 testes (autenticação + autorização)

| Endpoint | Cenário | Status esperado |
| --- | --- | --- |
| `POST /produtos` | Admin cadastra produto com token válido | 201 |
| `POST /produtos` | Mesmo nome de produto duplicado | 400 |
| `POST /produtos` | Sem token de autenticação | 401 |
| `POST /produtos` | Token de usuário não-admin | 403 |

> Os specs de API usam `cy.request` direto (em vez de `fetch` ou `axios`) — aproveitam todo o tooling do Cypress: retries, logs visuais e o relatório HTML automático.

---

## 🔑 Decisões técnicas relevantes

### Por que criar admin + produto via API antes dos testes de compra?

O ServeRest **reseta o banco de dados a cada poucas horas**. Depender de produtos pré-existentes deixaria os testes _flaky_ (passariam ou falhariam dependendo do momento da execução). A solução: cada execução cria seu próprio admin via API, autentica, cria um produto único (com timestamp no nome) e usa esse produto nos testes de UI.

Esse padrão se chama **"API for setup, UI for assertion"** e é recomendado pela documentação oficial do Cypress.

### Por que cache do Cypress local ao projeto?

Em ambientes Windows com Defender ou OneDrive, o cache padrão em `%LOCALAPPDATA%\Cypress\Cache\` pode ser bloqueado/movido. Movi para `./.cypress-cache/` (gitignored) e configurei via `cross-env CYPRESS_CACHE_FOLDER=./.cypress-cache` em todos os scripts npm. Resultado: instalação confiável em qualquer máquina Windows.

### Por que sem `cypress.env.json`?

Como cada teste cria seu próprio usuário/admin via Faker, **não existem credenciais fixas** que precisem ser secretas. A `apiUrl` (que é pública) está no `cypress.config.js`. Não há necessidade de variáveis de ambiente locais.

---

## 🚀 Melhorias futuras (roadmap)

A suíte está estável e em estado de entrega, mas evoluções naturais que poderiam ser aplicadas em iterações futuras:

### Performance e paralelização

- **Execução paralela local** — adicionar [`cypress-parallel`](https://www.npmjs.com/package/cypress-parallel) para dividir os specs em N workers simultâneos na mesma máquina. Estimativa: redução de ~50% no tempo total de execução (de ~1m12s para ~35-40s com 2 workers).
- **Paralelização em CI via matriz do GitHub Actions** — separar `frontend` e `api` em jobs distintos rodando em runners diferentes. Os 2 jobs rodam simultaneamente e o tempo total cai para ~36s.

### CI/CD

- **GitHub Actions** com workflow disparado em cada `push` e `pull_request` rodando lint + testes automaticamente.
- **Badge de status** no topo do README (✅ tests passing) — feedback visual imediato pra qualquer pessoa que abra o repositório.
- **Cache** do `node_modules` e do binário do Cypress entre execuções de CI para acelerar runs subsequentes.
- **Upload do relatório HTML** como artefato do GitHub Actions, baixável diretamente da página da execução.

### Qualidade automatizada

- **Husky + lint-staged** para hooks de pre-commit que rodam ESLint e Prettier automaticamente antes de cada commit, impedindo que código fora do padrão entre no histórico.
- **commitlint** para validar mensagens de commit contra o padrão Conventional Commits no momento do commit.

### Cobertura adicional

- **Cross-browser testing** — atualmente os testes rodam no Electron (default). Estender para Chrome, Firefox e Edge usando o flag `--browser` do Cypress.
- **Validação de schema mais rigorosa nos testes de API** — usar [AJV](https://ajv.js.org/) ou [Joi](https://joi.dev/) para validar respostas contra um JSON Schema completo em vez de apenas verificar propriedades individuais.
- **Test tagging com `@cypress/grep`** — permitir rodar subconjuntos por tag (`@smoke`, `@regression`, `@critical`), útil quando a suíte cresce.
- **Assertivas de performance em testes de API** — medir tempo de resposta e falhar se passar de um limiar (ex: `response.duration < 500ms`).

### Robustez

- **Cleanup global** com hook `after` global em `support/e2e.js` para garantir limpeza de dados de teste mesmo em caso de falha.
- **Retentativas com `cy.retry`** customizado em pontos sensíveis a flakiness (rede instável durante chamadas de API externa).

---

## 📜 Convenção de commits

Este projeto adota o padrão [Conventional Commits](https://www.conventionalcommits.org/).

| Tipo | Quando usar | Exemplo |
| --- | --- | --- |
| `feat` | Nova funcionalidade ou estrutura de teste | `feat: implementa infraestrutura de testes (POM, custom commands, factories)` |
| `test` | Mudanças em arquivos de teste | `test(frontend): cenarios de cadastro de usuario` |
| `fix` | Correção de bug ou teste com falha | `fix: corrige assertiva de mensagem de lista vazia` |
| `refactor` | Reorganização sem mudar comportamento | `refactor: remove codigo morto e centraliza assertivas no POM` |
| `chore` | Configuração, dependências, ferramentas | `chore: configura ESLint, Prettier e EditorConfig` |
| `docs` | Documentação | `docs: adiciona README com instrucoes de execucao` |

---

## 🔗 Links úteis

- [ServeRest — Frontend](https://front.serverest.dev/)
- [ServeRest — Swagger da API](https://serverest.dev/)
- [Documentação do Cypress](https://docs.cypress.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 👤 Autor

**Lucas Pericles**
[GitHub: @lucaspericlesbr](https://github.com/lucaspericlesbr)

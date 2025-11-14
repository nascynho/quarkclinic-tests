# QuarkClinic Tests

Projeto de testes automatizados para a plataforma de agendamento QuarkClinic. Implementa testes E2E para os fluxos principais: cadastro, login, agendamento de consulta presencial e envio de comprovante de pagamento.

## Fluxos Testados

1. Fluxo 1 - Cadastro de Novo Usuário
2. Fluxo 2 - Login de Usuário
3. Fluxo 3 - Agendamento de Consulta Presencial
4. Fluxo 4 - Envio de Comprovante de Pagamento

## Tecnologias

- Framework: Cypress
- Linguagem: JavaScript
- Gerenciador de Pacotes: npm
- Ambiente: Node.js 14+

## Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/nascynho/quarkclinic-tests.git
cd quarkclinic-tests
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Verificar Instalação

```bash
npx cypress --version
```

## Executando os Testes

### Modo Interativo (Interface Gráfica)

```bash
npx cypress open
```

Selecione E2E Testing, escolha o navegador e clique em `spec.cy.js`.

### Modo Headless (Automatizado)

```bash
npx cypress run
```

### Teste Específico

```bash
npx cypress run --spec "cypress/e2e/spec.cy.js"
```

### Navegadores

```bash
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

## Estrutura do Projeto

```
quarkclinic-tests/
├── cypress/
│   ├── e2e/
│   │   └── spec.cy.js
│   ├── fixtures/
│   │   ├── example.json
│   │   └── comprovante_pix.jpg
│   └── support/
│       ├── e2e.js
│       └── commands.js
├── cypress.config.js
├── package.json
├── README.md
├── TIPOS_DE_TESTES.md
└── FUNDAMENTOS_TESTES.md
```

## Testes Disponíveis

**Fluxo 1: Cadastro**
- Cria novo usuário com dados dinâmicos
- Validações: Status HTTP 200/201, nome do usuário exibido

**Fluxo 2: Login**
- Realiza login com credenciais válidas
- Validações: Status HTTP 200, mensagem de boas-vindas

**Fluxo 3: Agendamento**
- Agenda consulta presencial com rotação de horários
- Validações: ID do agendamento, especialidade, mensagem de sucesso

**Fluxo 4: Comprovante**
- Envia comprovante de pagamento
- Validações: Confirmação de envio

## Recursos

- Dados dinâmicos gerados a cada execução
- CPF válido com dígitos verificadores
- Horários rotacionam a cada teste
- Função login() reutilizável
- Validação de APIs com cy.intercept()

## Boas Práticas

- Estrutura clara e organizada
- Seletores semânticos (data-cy)
- Esperas baseadas em requisições de rede
- Assertivas precisas com mensagens de erro
- Sem esperas estáticas

## Troubleshooting

**"cy.contains not found"**
```javascript
cy.contains('Texto', { timeout: 20000 }).should('be.visible')
```

**"Element is not visible"**
```javascript
cy.get('[selector]').click({ force: true })
```

**Testes instáveis**
- Verificar se não há cy.wait(segundos)
- Usar cy.intercept() + cy.wait() para requisições

## Documentação

- [TIPOS_DE_TESTES.md](./TIPOS_DE_TESTES.md) - Caixa Preta, Branca e Cinza
- [FUNDAMENTOS_TESTES.md](./FUNDAMENTOS_TESTES.md) - Plano de Testes e Casos Manuais

## Links Úteis

- [Documentação Cypress](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)

---

Versão: 1.0.0 | Última atualização: 14 de Novembro de 2025

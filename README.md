# QuarkClinic Tests - Testes Automatizados com Cypress

## 📋 Descrição

Projeto de testes automatizados para a plataforma de agendamento QuarkClinic. O projeto implementa testes E2E (End-to-End) para os fluxos principais da aplicação, incluindo cadastro, login, agendamento de consulta presencial e envio de comprovante de pagamento.

## 🎯 Fluxos Testados

1. **Fluxo 1 - Cadastro de Novo Usuário**: Cria uma nova conta de paciente com dados dinâmicos
2. **Fluxo 2 - Login de Usuário**: Realiza login com credenciais válidas
3. **Fluxo 3 - Agendamento de Consulta**: Agenda uma consulta presencial com especialidade, clínica e horário
4. **Fluxo 4 - Envio de Comprovante**: Envia comprovante de pagamento via transferência bancária

## 🛠 Tecnologias Utilizadas

- **Framework**: [Cypress](https://www.cypress.io/) v13.0.0+
- **Linguagem**: JavaScript
- **Gerenciador de Pacotes**: npm
- **Ambiente**: Node.js 14+

## 📦 Instalação

### 1. Clonar o Repositório

```bash
git clone https://github.com/nascynho/quarkclinic-tests.git
cd quarkclinic-tests
```

### 2. Instalar Dependências

```bash
npm install
```

Este comando instalará todas as dependências definidas no `package.json`, incluindo o Cypress e suas dependências.

### 3. Verificar Instalação

Para verificar se o Cypress foi instalado corretamente:

```bash
npx cypress --version
```

## 🚀 Executando os Testes

### Modo Interativo (Recomendado para Desenvolvimento)

Abre o Cypress Dashboard onde você pode visualizar cada teste em tempo real:

```bash
npx cypress open
```

Depois:
1. Selecione **E2E Testing**
2. Escolha seu navegador (Chrome, Firefox, Edge, etc.)
3. Clique em `spec.cy.js` para executar todos os testes

### Modo Headless (CI/CD)

Executa todos os testes em background sem interface gráfica (ideal para pipelines):

```bash
npx cypress run
```

### Executar Teste Específico

```bash
npx cypress run --spec "cypress/e2e/spec.cy.js"
```

### Executar com Navegador Específico

```bash
# Chrome
npx cypress run --browser chrome

# Firefox
npx cypress run --browser firefox

# Edge
npx cypress run --browser edge
```

### Modo Debug

Para depuração de testes específicos:

```bash
npx cypress run --spec "cypress/e2e/spec.cy.js" --headed
```

## 📁 Estrutura do Projeto

```
quarkclinic-tests/
├── cypress/
│   ├── e2e/
│   │   └── spec.cy.js              # Arquivo principal com todos os testes
│   ├── fixtures/
│   │   ├── example.json            # Dados de exemplo
│   │   └── comprovante_pix.jpg     # Imagem de comprovante para upload
│   ├── support/
│   │   ├── e2e.js                  # Configurações globais E2E
│   │   └── commands.js             # Comandos customizados
│   ├── downloads/                  # Downloads de testes
│   └── screenshots/                # Screenshots de falhas
├── cypress.config.js               # Configuração do Cypress
├── package.json                    # Dependências do projeto
├── TIPOS_DE_TESTES.md             # Documentação: Caixa Preta, Branca e Cinza
├── FUNDAMENTOS_TESTES.md          # Documentação: Plano de Testes
└── README.md                       # Este arquivo
```

## ⚙️ Configuração

### cypress.config.js

O arquivo de configuração define:
- URL base da aplicação
- Timeouts globais
- Configurações de viewport
- Plugins utilizados

Para modificar a URL base, edite:
```javascript
baseUrl: 'https://agendamento.quarkclinic.com.br'
```

## 📝 Testes Disponíveis

### Fluxo 1: Cadastro
- **Título**: Fluxo 1 - Usuário Cadastro
- **Descrição**: Testa criação de novo usuário com dados dinâmicos
- **Validações**:
  - Status HTTP: 200 ou 201
  - Nome do usuário aparece na tela

### Fluxo 2: Login
- **Título**: Fluxo 2 - Usuário Login
- **Descrição**: Testa login com credenciais válidas
- **Validações**:
  - Status HTTP: 200 para login e perfil
  - Mensagem "Bem-vindo(a)" é exibida

### Fluxo 3: Agendamento
- **Título**: Fluxo 3 Agendamento Consulta
- **Descrição**: Testa agendamento de consulta presencial
- **Validações**:
  - ID do agendamento existe
  - Especialidade é retornada
  - Mensagem de sucesso é exibida
  - **Recurso especial**: Horários rotacionam a cada execução

### Fluxo 4: Comprovante
- **Título**: Fluxo 4 comprovante de Pgt
- **Descrição**: Testa envio de comprovante de pagamento
- **Validações**:
  - Comprovante é enviado com sucesso
  - Mensagem "Obrigado por enviar! Iremos analisar!" é exibida

## 🔄 Dados Dinâmicos

Os testes geram dados aleatórios a cada execução:

- **CPF**: Gerado automaticamente com dígitos verificadores válidos
- **Email**: `usuario{random}@teste.com`
- **Telefone**: `8498{random}`
- **Nome**: `User Teste {random}`
- **Horário**: Rotaciona entre os disponíveis a cada teste

## 🌐 Boas Práticas Implementadas

✅ **Estrutura Clara**: Organização lógica dos testes por fluxo  
✅ **Reutilização**: Função `login()` reutilizável em múltiplos testes  
✅ **Seletores Semânticos**: Uso de `data-cy` attributes  
✅ **Esperas Inteligentes**: `cy.intercept()` + `cy.wait()` para requisições de rede  
✅ **Assertivas Precisas**: Validações claras e com mensagens de erro  
✅ **Dados Dinâmicos**: Novos dados gerados a cada execução  
✅ **Variáveis de Ambiente**: Reutilização de dados entre testes  

## 🐛 Troubleshooting

### Problema: "cy.contains not found"
**Solução**: Aumentar o timeout
```javascript
cy.contains('Texto', { timeout: 20000 }).should('be.visible')
```

### Problema: "Element is not visible"
**Solução**: Usar `{ force: true }` apenas quando necessário
```javascript
cy.get('[selector]').click({ force: true })
```

### Problema: Testes instáveis (flaky)
**Solução**: Verificar se não há `cy.wait(segundos)` e usar `cy.intercept()` + `cy.wait()`
```javascript
// ❌ Evitar
cy.wait(3000)

// ✅ Usar
cy.intercept('POST', '**/api/endpoint').as('request')
cy.wait('@request')
```

### Problema: "Timed out retrying"
**Solução**: Aumentar timeout ou verificar seletor
```javascript
cy.get('[selector]', { timeout: 20000 }).should('exist')
```

## 📊 Relatório de Testes

Após executar `npx cypress run`, um relatório é gerado em:
```
cypress/videos/
cypress/screenshots/
```

## 🔐 Variáveis de Ambiente

Você pode definir variáveis de ambiente no `cypress.config.js`:

```javascript
env: {
  email: 'usuario@teste.com',
  senha: 'senha123'
}
```

Ou via linha de comando:
```bash
npx cypress run --env email=teste@teste.com,senha=123456
```

## 📚 Documentação Adicional

- **[TIPOS_DE_TESTES.md](./TIPOS_DE_TESTES.md)**: Explicação detalhada sobre Caixa Preta, Branca e Cinza
- **[FUNDAMENTOS_TESTES.md](./FUNDAMENTOS_TESTES.md)**: Plano de Testes e Casos de Teste Manuais

## 🔗 Links Úteis

- [Documentação Cypress](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Interception](https://docs.cypress.io/api/commands/intercept)

## 👤 Autor

- **Desenvolvedor**: Gabriel
- **Projeto**: QuarkClinic Tests
- **Repository**: https://github.com/nascynho/quarkclinic-tests

## 📄 Licença

Este projeto é de código aberto e disponível sob a licença MIT.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório GitHub.

---

**Última atualização**: 14 de Novembro de 2025  
**Versão**: 1.0.0

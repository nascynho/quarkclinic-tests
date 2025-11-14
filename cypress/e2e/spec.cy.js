describe('Fluxos da QuarkClinic', () => {

  // funcao login - para reutilizar
  const login = () => {
    const email = Cypress.env('email') || 'usuario1234@teste.com'
    const senha = Cypress.env('senha') || 'Senha@123'

    cy.visit('https://agendamento.quarkclinic.com.br/index/363622206')
    cy.get('[data-cy="btn-login"]').click()
    cy.get('[data-cy="campo-usuario-input"]').type(email)
    cy.get('[name="password"]').type(senha)
    cy.get('[data-cy="checkbox-aceita-politicas"] label.custom-control-label').click()
    cy.get('[name="cb-login"]').check({ force: true })
    cy.get('[data-cy="btn-submit-login"]').click()

    // assert - login
    cy.contains('Consulta Presencial', { timeout: 15000 }).should('be.visible')
  }


  it('Fluxo 1 - Usuário Cadastro', () => {

    // funcao para gerar cpf valido
    function gerarCPF() {
      const n = []
      for (let i = 0; i < 9; i++) n.push(Math.floor(Math.random() * 10))
      let soma1 = 0
      for (let i = 0; i < 9; i++) soma1 += n[i] * (10 - i)
      let dig1 = 11 - (soma1 % 11)
      if (dig1 >= 10) dig1 = 0
      n.push(dig1)
      let soma2 = 0
      for (let i = 0; i < 10; i++) soma2 += n[i] * (11 - i)
      let dig2 = 11 - (soma2 % 11)
      if (dig2 >= 10) dig2 = 0
      n.push(dig2)
      return n.join('')
    }

    function formatarCPF(cpfDigits) {
      return cpfDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    // variaveis
    const random = Math.floor(Math.random() * 10000)
    const nome = `User Teste ${random}`
    const numero = `8498${Math.floor(1000000 + Math.random() * 8999999)}`
    const email = `usuario${random}@teste.com`
    const senha = 'Senha@123'
    const cpf = formatarCPF(gerarCPF())

    // salvar variaveis para proximo fluxo
    Cypress.env('email', email)
    Cypress.env('senha', senha)

    cy.visit('https://agendamento.quarkclinic.com.br/index/363622206')
    cy.get('[data-cy="btn-cadastro"]').click()
    cy.get('[data-cy="campo-nome-input"]').type(nome)
    cy.get('[data-cy="campo-telefone-input"]').type(numero)
    cy.get('[data-cy="campo-sexo-select"]').select('MASCULINO')
    cy.get('[data-cy="campo-data-nascimento-input"]').type('25052006')
    cy.get('input[placeholder="Email"]').type(email)
    cy.get('[data-cy="campo-tipo-documento-select"]').select('CPF')
    cy.get('[data-cy="campo-numero-documento-input"]').type(cpf)
    cy.get('#senha').type(senha)
    cy.get('[data-cy="campo-confirmar-senha-input"]').type(senha)
    cy.get('[name="cb-cadastro"]').check({ force: true })

    // requisicao da criacao
    cy.intercept('POST', '**/api/social/usuarios').as('criarConta')
    cy.get('[data-cy="btn-criar-conta"]').click()

    // validacao api criacao
    cy.wait('@criarConta', { timeout: 10000 })
      .its('response.statusCode')
      .should('be.oneOf', [200, 201])

    // validacao visual -- nome 'User'
    cy.contains('User', { timeout: 10000 }).should('be.visible')
  })

  it('Fluxo 2 - Usuário Login', () => {

    // variaveis fluxo anterior - validas
    const email = Cypress.env('email')
    const senha = Cypress.env('senha')

    cy.visit('https://agendamento.quarkclinic.com.br/index/363622206')
    cy.get('[data-cy="btn-login"]').click()
    cy.get('[data-cy="campo-usuario-input"]').type(email)
    cy.get('[name="password"]').type(senha)
    cy.get('[data-cy="checkbox-aceita-politicas"] label.custom-control-label').click()
    cy.get('[name="cb-login"]').check({ force: true })

    cy.intercept('POST', '**/api/auth/login').as('login')
    cy.intercept('GET', '**/api/protected/me').as('perfil')

    cy.get('[data-cy="btn-submit-login"]').click()

    cy.wait('@login').its('response.statusCode').should('eq', 200)
    cy.wait('@perfil').its('response.statusCode').should('eq', 200)

    cy.contains('Bem-vindo(a)', { timeout: 15000 }).should('be.visible')
  })

  it('Fluxo 3 Agendamento Consulta', () => {

    // funcao login
    login()

    cy.contains('Consulta Presencial', { timeout: 15000 }).click()

    // interceptar rotas
    cy.intercept('GET', '**/api/agendamentos/convenios**').as('carregarConvenios')
    cy.intercept('GET', '**/api/agendamentos/especialidades**').as('carregarEspecialidades')
    cy.intercept('GET', '**/api/agendamentos/agendas**').as('carregarAgenda')
    cy.intercept('POST', '**/api/protected/me/agendamentos').as('agendarConsulta')

    // selecionar convênio particular
    cy.wait('@carregarConvenios', { timeout: 20000 })
    cy.contains('PARTICULAR').click()

    // selecionar especialidade cardiologia
    cy.wait('@carregarEspecialidades', { timeout: 20000 })
    cy.contains('CARDIOLOGIA').click()

    // clinica ja vem pre-selecionada
    cy.wait('@carregarAgenda', { timeout: 20000 })

    // selecionar horario disponivel -- rotaciona a cada execucao
    cy.get('[data-cy="agenda-item-horarios-container"] > div').then(($elementos) => {
      const indexAtual = Cypress.env('proximoHorarioIndex') || 0
      const indexProximo = indexAtual % $elementos.length

      const $el = $elementos[indexProximo]
      const horarioSelecionado = $el.textContent.trim()

      Cypress.env('horaSelecionada', horarioSelecionado)
      Cypress.env('proximoHorarioIndex', indexProximo + 1)

      cy.wrap($el).click()
    })

    // selecionar paciente cadastrado
    cy.get('[data-cy="paciente-card-radio-wrapper"]').first().then(($paciente) => {
      const nomePaciente = $paciente.text().trim()
      Cypress.env('pacienteSelecionado', nomePaciente)
      cy.wrap($paciente).click()
    })

    // confirmar agendamento
    cy.get('[data-cy="confirmacao-btn-confirmar"]').click()

    // validacao api agendamento
    cy.wait('@agendarConsulta', { timeout: 20000 }).then((intercept) => {
      const body = intercept.response.body

      // assert id agendamento
      expect(body.id, 'ID do agendamento retornado pela API').to.exist

      // assert especialidade
      expect(body.especialidade || body.specialty, 'Especialidade do agendamento').to.exist

      // guardar dados do agendamento
      Cypress.env('agendamentoAPI', body)
      Cypress.env('idAgendamento', body.id)
    })

    // validacao visual -- agendamento efetuado com sucesso
    cy.contains(/Agendamento (efetuado|realizado|concluído)/i, { timeout: 20000 }).should('be.visible')
  })

  it('Fluxo 4 comprovante de Pgt', () => {

    // funcao login
    login()

    cy.contains('Consulta Presencial', { timeout: 15000 }).click()

    // interceptar rotas
    cy.intercept('GET', '**/api/agendamentos/convenios**').as('carregarConvenios')
    cy.intercept('GET', '**/api/agendamentos/especialidades**').as('carregarEspecialidades')
    cy.intercept('GET', '**/api/agendamentos/agendas**').as('carregarAgenda')
    cy.intercept('POST', '**/api/protected/me/agendamentos').as('agendarConsulta')
    cy.intercept('POST', '**/api/**comprovante**').as('enviarComprovante')

    // selecionar convênio particular
    cy.wait('@carregarConvenios', { timeout: 20000 })
    cy.contains('PARTICULAR').click()

    // selecionar especialidade cardiologia
    cy.wait('@carregarEspecialidades', { timeout: 20000 })
    cy.contains('CARDIOLOGIA').click()

    // clínica ja vem pre-selecionada
    cy.wait('@carregarAgenda', { timeout: 20000 })

    // selecionar horario disponivel -- rotaciona a cada execucao
    cy.get('[data-cy="agenda-item-horarios-container"] > div').then(($elementos) => {
      const indexAtual = Cypress.env('proximoHorarioIndex') || 0
      const indexProximo = indexAtual % $elementos.length

      const $el = $elementos[indexProximo]
      const horarioSelecionado = $el.textContent.trim()

      Cypress.env('horaSelecionada', horarioSelecionado)
      Cypress.env('proximoHorarioIndex', indexProximo + 1)

      cy.wrap($el).click()
    })

    // selecionar paciente cadastrado
    cy.get('[data-cy="paciente-card-radio-wrapper"]').first().click()

    // confirmar agendamento
    cy.get('[data-cy="confirmacao-btn-confirmar"]').click()

    // validacao api agendamento
    cy.wait('@agendarConsulta', { timeout: 20000 }).then((intercept) => {
      const body = intercept.response.body
      const agendamentoId = body.id
      Cypress.env('agendamentoId', agendamentoId)
    })

    // validacao visual -- agendamento efetuado com sucesso
    cy.contains(/Agendamento (efetuado|realizado|concluído)/i, { timeout: 20000 }).should('be.visible')

    // clicar em "pagamento por transf. bancaria"
    cy.contains('Pagamento por Transf. Bancária', { timeout: 15000 }).click()

    // upload comprovante de pagamento
    cy.get('input[type="file"]').selectFile('cypress/fixtures/comprovante_pix.jpg', { force: true })

    // adicionar observacao
    cy.get('[data-cy="observacao-input"], [placeholder*="observa"], textarea').first().type('Comprovante de teste')

    // clicar em "enviar comprovante"
    cy.get('[data-cy="enviar-comprovante-btn"], button:contains("Enviar")').first().click()

    // validacao visual -- comprovante enviado
    cy.contains('Obrigado por enviar! Iremos analisar!', { timeout: 15000 }).should('be.visible')
  })

})

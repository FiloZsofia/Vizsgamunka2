describe('Főoldal Tesztek', () => {

  beforeEach(() => {
    cy.visit('/index.html')
  })

  it('Sikeresen betöltődik a főoldal és látható a logó', () => {
    cy.contains('Festményvilág').should('be.visible')
  })

  it('A navigációs menü elemei elérhetőek', () => {
    cy.contains('Termékek').should('exist')
    cy.contains('Rólunk').should('exist')
    cy.contains('Termék feltöltése').should('exist')
    cy.contains('Egyedi rendelés').should('exist')
  })

  it('A háttér videó automatikusan elindul, a Termékek oldalra tovább lehet menni', () => {
    cy.get('[data-test-id="video"]')
      .should('be.visible')
      .and('have.prop', 'paused', false) 
    cy.get('[data-test-id="megnezem"]').should('exist').click()
    cy.url().should('include', '/Products/termekek.html')
    })
})
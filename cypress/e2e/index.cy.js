describe('Főoldal Tesztek', () => {

  beforeEach(() => {
    cy.visit('/index.html')
  })

  it('Sikeresen betöltődik a főoldal és látható a logó', () => {
    cy.contains('Festményvilág').should('be.visible')
  })

    it('Navigáció tesztelése vendégként (nyilvános menüpontok)', () => {
    cy.get('#nav-products').click()
    cy.url().should('include', '/Products/termekek.html')
    cy.get('.logo').click()

    cy.get('#nav-about-us').click()
    cy.url().should('include', '/AboutUs/rolunk.html')
    cy.get('.logo').click()

    cy.get('#btnLogin').click()
    cy.get('.popup-container').should('be.visible').and('contain', 'Bejelentkezés')
    cy.get('[data-test-id="btnClose"]').click()
    cy.get('.popup-container').should('not.be.visible')
  })

  it('A védett menüpontok (Feltöltés, Rendelés, Kosár) alert ablakot dobnak', () => {
    cy.checkAuthenticatedButton('#feltoltes', 'Bejelentkezés szükséges')
    cy.checkAuthenticatedButton('#rendeles', 'Bejelentkezés szükséges')
    cy.checkAuthenticatedButton('#cart-button', 'Be kell jelentkezned!')
  })

  it('A háttér videó automatikusan elindul, a Termékek oldalra tovább lehet menni', () => {
    cy.get('[data-test-id="video"]')
      .should('be.visible')
      .and('have.prop', 'paused', false) 
    cy.get('[data-test-id="megnezem"]').should('exist').click()
    cy.url().should('include', '/Products/termekek.html')
    })

    it('A Bővebben gomb továbbvisz a Rólunk menüpontra, a További termékek gomb a Termékekhez', () => {
      cy.get('[data-test-id="aboutUs"]').should('be.visible').click()
      cy.url().should('include', '/AboutUs/rolunk.html')
      cy.visit('/')

      cy.get('[data-test-id="more-products-button"]').should('be.visible').click()
      cy.url().should('include', '/Products/termekek.html')
    })
})
// import { before, it } from 'mocha';
import '../support/commands';

describe('Termékfeltöltés tesztesetek', () => {
    beforeEach(() => {
        cy.visit('/index.html')
    });

    it('A menüpont bejelentkezés nélkül nem elérhető, bejelentkezést követően betöltődik', () => {
        // cy.checkAuthenticatedButton('#feltoltes', 'Bejelentkezés szükséges')

        //  cy.get('[data-test-id="login-button"]').click()
        //  cy.get('#login-modal').should('be.visible')
        //  cy.get('#username').type('eper')
        // cy.get('#password').type('eper')
        // cy.get('#login-submit-btn').click()

        cy.login('eper', 'eper', { expectedStatus: 'success'});
        cy.get('#feltoltes').click();
        cy.url().should('include', '/Products/termekek.html')
        //IDE MEG KELL HÍVNI A LOGOUT-OT, amikor már meg lesz írva
    });

    it.only('Sikeres termékfeltöltés érvényes adatokkal', () => {
        cy.login('eper', 'eper', { expectedStatus: 'success'});
        cy.visit('../ProductsUpload/termek-feltoltese.html');

        cy.addProduct();
        //Ezután átmegyünk a termékek menüpontra, és ell., hogy köztük van-e
    });
});
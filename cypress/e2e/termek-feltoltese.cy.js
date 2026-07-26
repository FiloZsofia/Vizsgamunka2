// import { before, it } from 'mocha';
import '../support/commands';

describe('Termékfeltöltés tesztesetek', () => {
    beforeEach(() => {
        cy.visit('/index.html')
    });

    it('Sikeres termékfeltöltés érvényes adatokkal', () => {
        cy.login('eper', 'eper', { expectedStatus: 'success'});
        cy.visit('../ProductsUpload/termek-feltoltese.html');

        cy.addProduct();
        //Ezután átmegyünk a termékek menüpontra, és ell., hogy köztük van-e
    });
});
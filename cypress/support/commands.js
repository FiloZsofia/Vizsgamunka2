// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password, options = {}) => {
    // Opciók alapértelmezett értékei (ha nem adjuk meg, sikeres belépést várunk)
    const { expectedStatus = 'success', errorMessage = '' } = options;

    cy.wait(2000)
    cy.get('[data-test-id="login-open"]').click()
    cy.get('[data-test-id="login-modal"]').should('be.visible')

    if (username) {
        cy.get('#user-login').clear().type(username)
    } else {
        cy.get('#user-login').clear()
    }

    if (password) {
        cy.get('#pass-login').clear().type(password)
    } else {
        cy.get('#pass-login').clear()
    }

    cy.get('[data-test-id="login-submit-button"]').click()

    if (expectedStatus === 'success') {
        // 1. Helyes adatok -> Popup bezáródik, bejelentkezett állapot
        cy.get('[data-test-id="login-modal"]').should('not.be.visible')
        /*cy.get('#user-profile-menu').should('be.visible')*/ // Pl. profil ikon látható
    } else if (expectedStatus === 'error') {
        // 2-5. Hibás adatok -> Modal marad, hibaüzenet megjelenik
        cy.get('[data-test-id="login-modal"]').should('be.visible')
        if (errorMessage) {
            cy.get('.error-message').should('contain', errorMessage)
        }
    }
});

Cypress.Commands.add('addProduct', (productData = {}) => {
  const defaultData = {
    title: 'Csendélet eperrel',
    artist: 'Minta Művész',
    price: '45000',
    description: 'Gyönyörű olajfestmény vásznon.',
    createdYear: '2024',
    imgUrl: '../Assets/images/teszt_kep.jpg',
    size: '60x80',
    fileName: 'teszt_kep.jpg',
    xcm: 60,
    ycm: 80
  };

  const data = { ...defaultData, ...productData };

  // 1. GET Intercept-ek (a dinamikus adatokhoz)
  cy.intercept('GET', 'http://localhost:8080/material/get-all', [
    { id: 1, name: 'Olaj' },
    { id: 2, name: 'Akril' }
  ]).as('getMaterials');

  cy.intercept('GET', 'http://localhost:8080/style/get-all', [
    { id: 1, name: 'Csendélet' },
    { id: 2, name: 'Táj kép' }
  ]).as('getStyles');

  // 2. POST Intercept a sikeres válasz szimulálására
  cy.intercept('POST', 'http://localhost:8080/product/add', {
    statusCode: 200,
    body: { message: 'A termék feltöltve.' }
  }).as('addProductRequest');

  // 3. Mezők kitöltése
  cy.get('#productName').clear().type(data.title);
  cy.get('#artist').clear().type(data.artist);
  cy.get('#ar').clear().type(data.price);
  cy.get('#leiras').clear().type(data.description);
  cy.get('#keszitesEve').clear().type(data.createdYear);

  // Méret megadása - régebben #meret select volt (data.size, pl. "60x80"),
  // most #meretHossz / #meretSzeles kulon szammezok (data.xcm / data.ycm).
  cy.get('body').then(($body) => {
    if ($body.find('#meret').length > 0) {
      cy.get('#meret').select(data.size);
    } else if ($body.find('#meretHossz').length > 0) {
      cy.get('#meretHossz').clear().type(String(data.xcm));
      cy.get('#meretSzeles').clear().type(String(data.ycm));
    }
  });

  // Kép útvonal kitöltése (ha van #imgUrl mező)
  cy.get('body').then(($body) => {
    if ($body.find('#imgUrl').length > 0) {
      cy.get('#imgUrl').clear().type(data.imgUrl);
    }
  });

  // 4. Kép feltöltése (fájlkiválasztás)
  cy.get('#file-input').selectFile({
    contents: Cypress.Buffer.from('fake image content'),
    fileName: data.fileName,
    mimeType: 'image/jpeg',
  }, { force: true });

  // 5. Preview megjelenésének ellenőrzése
  cy.get('.uploaded-image').should('be.visible');

  // 6. Beküldés gomb kattintás
  cy.get('#add-products-button').click();

  // 7. Státuszüzenet és hálózati kérés ellenőrzése
  cy.get('#feltoltes-status')
    .should('be.visible')
    .and('have.text', 'A termék feltöltve.');

  cy.wait('@addProductRequest').its('request.body').should('deep.include', {
    title: data.title,
    artist: data.artist,
    price: data.price,
    description: data.description,
    createdYear: data.createdYear,
    imgUrl: data.imgUrl,
    xcm: data.xcm,
    ycm: data.ycm
  });
});
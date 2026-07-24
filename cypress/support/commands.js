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
Cypress.Commands.add('checkAuthenticatedButton', (selector, expectedText) => {
  let alertText = '';

  // Elkapjuk az alertet
  cy.on('window:alert', (txt) => {
    alertText = txt;
  });

  cy.get(selector).click();

  cy.should(() => {
    expect(alertText).to.equal(expectedText);
  });

  // Kiürítjük a változót, hogy ne ragadjon be a következő tesztre
  cy.should(() => {
    alertText = '';
  });
});

Cypress.Commands.add('login', (username, password, options = {}) => {
    // Opciók alapértelmezett értékei (ha nem adjuk meg, sikeres belépést várunk)
    const { expectedStatus = 'success', errorMessage = '' } = options;

    cy.get('[data-test-id="login-button"]').click()
    cy.get('[data-test-id="login-modal"]').should('be.visible')

    if (username) {
        cy.get('#username').clear().type(username)
    } else {
        cy.get('#username').clear()
    }

    if (password) {
        cy.get('#password').clear().type(password)
    } else {
        cy.get('#password').clear()
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
  // Alapértelmezett adatok, ha a híváskor nem adunk meg egyedit
  const defaultData = {
    title: 'Csendélet eperrel',
    artist: 'Minta Művész',
    price: '45000',
    description: 'Gyönyörű olajfestmény vásznon.',
    createdYear: '2024',
    fileName: 'teszt_kep.jpg',
    xCm: 40,
    yCm: 20
  };

  const data = { ...defaultData, ...productData };

  // 1. GET Intercept-ek megvárásra/elfogásra
  cy.intercept('GET', 'http://localhost:8080/material/get-all').as('getMaterials');
  cy.intercept('GET', 'http://localhost:8080/style/get-all').as('getStyles');

  // 2. POST Intercept a backend hívás szimulálásához
  cy.intercept('POST', 'http://localhost:8080/product/add', {
    statusCode: 200,
    body: { message: 'Termék sikeresen hozzáadva!' }
  }).as('addProductRequest');

  // 3. Mezők kitöltése
  cy.get('#productName').clear().type(data.title);
  cy.get('#artist').clear().type(data.artist);
  cy.get('#ar').clear().type(data.price);
  cy.get('#leiras').clear().type(data.description);
  cy.get('#keszitesEve').clear().type(data.createdYear);

  // 4. Kép feltöltése
  cy.get('#file-input').selectFile({
    contents: Cypress.Buffer.from('fake image content'),
    fileName: data.fileName,
    mimeType: 'image/jpeg',
  }, { force: true });

  // 5. Preview ellenőrzése
  cy.get('.uploaded-image').should('be.visible');

  // 6. Beküldés
  cy.get('#add-product-button').click();

  // 7. Hálózati kérés ellenőrzése
  cy.wait('@addProductRequest').its('request.body').should('deep.include', {
    title: data.title,
    artist: data.artist,
    price: data.price,
    description: data.description,
    createdYear: data.createdYear,
    xCm: data.xCm,
    yCm: data.yCm
  });
});
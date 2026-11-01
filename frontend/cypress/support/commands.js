/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
Cypress.Commands.add("login", () => {
  cy.visit("/#/login");

  cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
  cy.get('[data-cy="login-input-password"]').type("testtest");
  cy.get('[data-cy="login-submit"]').click();

  cy.get('[data-cy="nav-link-logout"]').should("be.visible");
});

Cypress.Commands.add("clearCart", () => {
  cy.get('[data-cy="nav-link-cart"]').click();

  cy.get('[data-cy="cart-empty"], [data-cy="cart-line-delete"]')
    .should("exist")
    .then(($el) => {
      if ($el.filter('[data-cy="cart-line-delete"]').length) {
        cy.get('[data-cy="cart-line-delete"]').click({ multiple: true });
        cy.get('[data-cy="cart-empty"]').should("be.visible");
      }
    });
});
Cypress.Commands.add("apiLogin", () => {
  return cy
    .request({
      method: "POST",
      url: `${Cypress.expose("apiUrl")}/login`,
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);

      return response.body.token;
    });
});

Cypress.Commands.add("clearCartApi", () => {
  cy.apiLogin().then((token) => {
    cy.request({
      method: "GET",
      url: `${Cypress.expose("apiUrl")}/orders`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      const orderLines = response.body.orderLines || [];

      orderLines.forEach((orderLine) => {
        cy.request({
          method: "DELETE",
          url: `${Cypress.expose("apiUrl")}/orders/${orderLine.id}/delete`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
        });
      });
    });
  });
});

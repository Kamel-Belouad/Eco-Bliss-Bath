import { faker } from "@faker-js/faker";
describe(" TEST- Autentification", () => {
  it("Connexion - Utilsateur avec des identifiants valides", () => {
    cy.login();
    cy.get('[data-cy="nav-link-logout"]').should("be.visible");
    cy.get('[data-cy="nav-link-cart"]').should("be.visible");
  });
});

describe("Smoke tests", () => {
  it("Vérifier la présence des champs et boutons de connexion", () => {
    cy.visit("/#/login");

    cy.get('[data-cy="login-input-username"]').should("be.visible");

    cy.get('[data-cy="login-input-password"]').should("be.visible");

    cy.get('[data-cy="login-submit"]')
      .should("be.visible")
      .and("not.be.disabled");
  });

  it("Vérifier la présence du bouton d'ajout au panier quand on est connecté", () => {
    cy.login();

    cy.get('[data-cy="nav-link-products"]').click();
    cy.get('[data-cy="product"]').should("have.length.greaterThan", 0);
    cy.get('[data-cy="product-link"]').first().click();

    cy.get('[data-cy="detail-product-add"]')
      .should("be.visible")
      .and("not.be.disabled");
  });
});

describe("Test de sécurité XSS", () => {
  it("ne doit pas exécuter une injection XSS dans /reviews", () => {
    cy.login();

    cy.visit("/#/reviews");

    const TitleReview = `Test XSS ${Date.now()}`;
    const xssPayload = "<img src=x onerror=alert('XSS TEST')>";

    cy.on("window:alert", () => {
      throw new Error("Une faille XSS a été détectée !");
    });

    cy.get('[data-cy="review-input-rating-images"] img').eq(1).click();
    cy.get('[data-cy="review-input-title"]').type(TitleReview);
    cy.get('[data-cy="review-input-comment"]').type(xssPayload);
    cy.get('[data-cy="review-submit"]').click();

    cy.contains('[data-cy="review-title"]', TitleReview)
      .closest('[data-cy="review-detail"]')
      .find('[data-cy="review-comment"]')
      .should("exist")
      .invoke("html")
      .then((html) => {
        expect(html).not.to.contain("onerror");
      });
  });
});

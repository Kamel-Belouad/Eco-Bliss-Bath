describe("TESTS - Panier", () => {
  beforeEach(() => {
    cy.login();
  });
  afterEach(() => {
    cy.clearCart();
  });
  it("le stock doit être supérieur à 1 pour pouvoir être ajouté", () => {
    cy.visit("/#/products/5");

    cy.get('[data-cy="detail-product-stock"]')
      .should("be.visible")
      .invoke("text")
      .should("match", /^\s*\d+\s+en stock\s*$/)
      .then((stockText) => {
        const stock = parseInt(stockText, 10);

        expect(stock).to.be.greaterThan(1);
      });
  });

  it("ajouter le produit au panier et vérifier sa présence", () => {
    cy.visit("/#/products/6");
    cy.contains("Dans la forêt").should("be.visible");
    cy.get('[data-cy="detail-product-quantity"]').clear().type("1");
    cy.get('[data-cy="detail-product-add"]').click();

    cy.url().should("include", "/cart");
    cy.get('[data-cy="cart-line"]')
      .should("be.visible")
      .and("contain", "Dans la forêt");
  });
  it("le stock diminue après l'ajout du produit au panier", () => {
    cy.visit("/#/products/5");

    cy.get('[data-cy="detail-product-stock"]')
      .should("be.visible")
      .invoke("text")
      .should("match", /^\s*\d+\s+en stock\s*$/)
      .then((stockText) => {
        const stockInitial = parseInt(stockText, 10);

        expect(stockInitial).to.be.greaterThan(1);

        cy.get('[data-cy="detail-product-quantity"]').clear().type("1");
        cy.get('[data-cy="detail-product-add"]').should("be.visible").click();
        cy.get('[data-cy="cart-line"]').should("be.visible");
        cy.get('[data-cy="cart-line-quantity"]').should("have.value", "1");

        cy.go("back");

        cy.get('[data-cy="detail-product-stock"]')
          .should("be.visible")
          .invoke("text")
          .should("match", /^\s*\d+\s+en stock\s*$/)
          .then((stockText) => {
            const stockFinal = parseInt(stockText, 10);

            expect(stockFinal).to.eq(stockInitial - 1);
          });
      });
  });
  it("Ajouter une quantité négative", () => {
    cy.intercept("**/orders/add").as("addToCart");
    cy.visit("/#/products/6");
    cy.contains("Dans la forêt").should("be.visible");
    cy.get('[data-cy="detail-product-quantity"]').clear().type("-1");

    cy.get('[data-cy="detail-product-add"]').click();
    cy.get("@addToCart.all").should("have.length", 0);

    cy.url().should("include", "/products/6");
  });

  it("Ajouter une quantité supérieure à 20", () => {
    cy.intercept("**/orders/add").as("addToCart");
    cy.visit("/#/products/6");
    cy.contains("Dans la forêt").should("be.visible");
    cy.get('[data-cy="detail-product-quantity"]').clear().type("21");

    cy.get('[data-cy="detail-product-add"]').click();
    cy.get("@addToCart.all").should("have.length", 0);

    cy.url().should("include", "/products/6"); //Anomalie: l'app redirige vers le panier et autorise l'ajout de quantité sup à 20
  });

  it("Ajouter un produit et vérifier le contenu du panier via l'API", () => {
    cy.visit("/#/products/6");
    cy.contains("Dans la forêt").should("be.visible");
    cy.get('[data-cy="detail-product-quantity"]').clear().type("1");

    cy.get('[data-cy="detail-product-add"]').should("be.visible").click();

    cy.apiLogin().then((token) => {
      cy.request({
        method: "GET",
        url: `${Cypress.expose("apiUrl")}/orders`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        const orderLines = response.body.orderLines;

        const addedProduct = orderLines.find(
          (orderLine) => orderLine.product.id === 6 && orderLine.quantity === 1,
        );

        expect(addedProduct).to.exist;
      });
    });
  });
});

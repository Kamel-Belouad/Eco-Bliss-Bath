import { faker } from "@faker-js/faker";
const apiUrl = Cypress.expose("apiUrl");
describe("Tests API", () => {
  it("GET/ orders - refuser l'accès au panier sans authentification", () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/orders`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(403); //Anomalie l'api retourne 401
    });
  });
  it("GET/ orders - Accéder au panier avec authentification", () => {
    cy.apiLogin().then((token) => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/orders`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("orderLines");
      });
    });
  });
  it("GET /products/{id} retourne la fiche d'un produit spécifique", () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/products`,
    }).then((productsResponse) => {
      expect(productsResponse.status).to.eq(200);
      expect(productsResponse.body).to.be.an("array");

      const productId = productsResponse.body[0].id;
      cy.request({
        method: "GET",
        url: `${apiUrl}/products/${productId}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        const productProperties = [
          "name",
          "availableStock",
          "skin",
          "aromas",
          "ingredients",
          "description",
          "price",
          "picture",
          "varieties",
        ];
        expect(response.body).to.have.property("id", productId);
        productProperties.forEach((property) => {
          expect(response.body).to.have.property(property);
        });
      });
    });
  });
  it("POST /login - utilisateur inconnu retourne 401", () => {
    const username = faker.internet.email();
    const password = faker.internet.password();

    cy.request({
      method: "POST",
      url: `${apiUrl}/login`,
      body: {
        username,
        password,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
  it("POST /login - utilisateur connu retourne 200", () => {
    cy.apiLogin();
  });

  it(" Orders/add - ajouter un produit disponible au panier", () => {
    cy.apiLogin().then((token) => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/products`,
      }).then((productsResponse) => {
        expect(productsResponse.status).to.eq(200);
        expect(productsResponse.body).to.be.an("array");

        const produitDisponible = productsResponse.body.find(
          (product) => product.availableStock > 1,
        );

        expect(produitDisponible).to.exist;

        cy.request({
          method: "POST",
          url: `${apiUrl}/orders/add`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            product: produitDisponible.id,
            quantity: 1,
          },
        }).then((response) => {
          // Anomalie : POST attendu, mais l'API autorise PUT pour l'ajout d'un produit disponible au panier.
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property("orderLines");
          expect(response.body.orderLines).to.have.length.greaterThan(0);

          expect(response.body.orderLines[0].product.id).to.eq(
            produitDisponible.id,
          );

          expect(response.body.orderLines[0].quantity).to.eq(1);
          cy.clearCartApi();
        });
      });
    });
  });

  it("Orders/add - ajouter un produit en rupture de stock", () => {
    cy.apiLogin().then((token) => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/products`,
      }).then((productsResponse) => {
        expect(productsResponse.status).to.eq(200);
        expect(productsResponse.body).to.be.an("array");

        const produitRupture = productsResponse.body.find(
          (product) => product.availableStock <= 0,
        );

        expect(produitRupture).to.exist;

        cy.request({
          method: "POST",
          url: `${apiUrl}/orders/add`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            product: produitRupture.id,
            quantity: 1,
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.be.oneOf([400, 409]);
        });
      });
    });
  });

  it("POST /reviews - ajouter un avis", () => {
    cy.apiLogin().then((token) => {
      cy.request({
        method: "POST",
        url: `${apiUrl}/reviews`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          title: "Test",
          comment: "TestTest",
          rating: 5,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});

describe("Logged-in User Page Tests", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad: window => {
        window.localStorage.setItem("promptify:token", Cypress.env("LOGIN_TOKEN"));
      },
    });
  });

  it("Main container of logged-in user exists", () => {
    cy.get('[data-testid="logged-in-main-container"]').should("exist");
  });
});

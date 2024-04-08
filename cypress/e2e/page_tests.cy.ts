describe("Page guest existence Tests", () => {
  it("Main container of guest page exists", () => {
    cy.visit("/");
    cy.get('[data-testid="guest-main-container"]').should("exist");
  });
});

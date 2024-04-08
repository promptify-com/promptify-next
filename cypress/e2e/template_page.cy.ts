describe("Template/Prompt Page Tests", () => {
  it("Main container of template/prompt page exists", () => {
    cy.visit("/prompt/flash-story-7bca63c8");
    cy.get('[data-testid="main-container-prompt-template"]').should("exist");
  });
});

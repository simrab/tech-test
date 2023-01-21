describe('Login', () => {
  it('should show error msg under input if submitting form with required value empty', () => {
    cy.visit('/login');
    cy.get('[data-test-id="submitLogin"]').click();
    cy.get('app-custom-input').contains('Required');
  });
});

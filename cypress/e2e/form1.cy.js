describe('Form 1 Automation', () => {
  
  it('Correct Input - Fills The Form -> Triggers Alert -> Sends GET Response', async () => {
    const data = await cy.fixture("form1");

    cy.visit(data.url);

    const emailField = cy.get(data.interactions.emailField.selector);
    emailField.type(data.interactions.emailField.input);

    const passwordField = cy.get(data.interactions.passwordField.selector);
    passwordField.type(data.interactions.passwordField.input);

    const checkBoxField = cy.get(data.interactions.checkBoxField.selector);
    checkBoxField.check();

    cy.intercept({
      url: `${data.url}*`,
      method: 'GET',
      query: { 
        email: data.interactions.emailField.input,
        password: data.interactions.passwordField.input
      },
    }).as('matchingSubmittedURL');

    const formSubmitButton = cy.get(data.interactions.formSubmitButton.selector);
    formSubmitButton.click();

    cy.on("window:alert", (alertText) => {
      expect(alertText).to.contain(data.expectations.onFormSubmit.alertText);
    });

    cy.wait('@matchingSubmittedURL');
  })
})
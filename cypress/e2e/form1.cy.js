const getData = (elements) => {
  return elements[Math.floor(Math.random() * elements.length)];
}

describe('Form 1 Automation', () => {
  
  it('Correct Input - Fills The Form -> Triggers Alert -> Sends GET Response', async () => {
    const {url, interactions, expectations} = await cy.fixture("form1");

    const email = getData(interactions.emailField.correctInputs);
    const password = getData(interactions.passwordField.correctInputs);

    cy.intercept({
      url: `${url}*`,
      method: 'GET',
      query: { 
        email,
        password
      },
    }).as('matchingSubmittedURL');

    cy.visit(url);

    const emailField = cy.get(interactions.emailField.selector);
    emailField.type(email);

    const passwordField = cy.get(interactions.passwordField.selector);
    passwordField.type(password);

    const checkBoxField = cy.get(interactions.checkBoxField.selector);
    checkBoxField.check();

    const formSubmitButton = cy.get(interactions.formSubmitButton.selector);
    formSubmitButton.click();

    cy.on("window:alert", (alertText) => {
      expect(alertText).to.contain(expectations.onFormSubmit.alertText);
    });

    cy.wait('@matchingSubmittedURL');
  })
})
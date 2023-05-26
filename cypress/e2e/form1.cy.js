import { interactions, expectations, url } from "../fixtures/form1.json";

const getData = (elements) => {
  return elements[Math.floor(Math.random() * elements.length)];
}

const interceptFormRequest = (email, password, alias) => {
  cy.intercept({
    url: `${url}*`,
    method: 'GET',
    query: { 
      email,
      password
    },
  }).as(alias);
}

const fillAndSubmitForm = (email, password) => {
  
  const emailField = cy.get(interactions.emailField.selector);
  emailField.type(email);

  const passwordField = cy.get(interactions.passwordField.selector);
  passwordField.type(password);

  const checkBoxField = cy.get(interactions.checkBoxField.selector);
  checkBoxField.check();

  const formSubmitButton = cy.get(interactions.formSubmitButton.selector);
  formSubmitButton.click();
}

describe('Form 1 Automation', () => {
  
  beforeEach(() => {
    cy.visit(url);
  })

  it('Correct Input - Fills Form -> Triggers Alert -> Sends GET Request', () => {

    const email = getData(interactions.emailField.correctInputs);
    const password = getData(interactions.passwordField.correctInputs);
    const alias = "matchingSubmittedURL"

    interceptFormRequest(email, password, alias);
    fillAndSubmitForm(email, password);

    cy.on("window:alert", (alertText) => {
      expect(alertText).to.contain(expectations.onFormSubmit.alertText);
    });

    cy.wait(`@${alias}`);
  })

  it("Incorrect Input - Fills Form -> Triggers Alert -> No GET Request", () => {
    const email = getData(interactions.emailField.incorrectInputs);
    const password = getData(interactions.passwordField.incorrectInputs);
    const alias = "submittedURLShouldFail"

    interceptFormRequest(email, password, alias);
    fillAndSubmitForm(email, password);

    cy.on("window:alert", (alertText) => {
      expect(alertText).to.contain(expectations.onFormSubmit.alertText);
    });

    cy.wait(`@${alias}`);

  })

})
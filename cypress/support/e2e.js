import './commands';
import 'cypress-plugin-api';
import 'cypress-mochawesome-reporter/register';

Cypress.on('uncaught:exception', () => {
  return false;
});

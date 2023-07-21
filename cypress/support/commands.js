// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import "cypress-mailosaur"

Cypress.Commands.add('login', (username, password) =>{
    cy.session([username, password], ()=>{
        cy.visit('http://localhost:3000/')
        cy.contains('Sign In').click()
        cy.get('input[placeholder*="Username"]').clear().type(username)
        cy.get('input[placeholder*="Password"]').clear().type(password)
        cy.contains('Sign In').click()
    },
    {
        cacheAcrossSpecs: true
    }    
    )

})
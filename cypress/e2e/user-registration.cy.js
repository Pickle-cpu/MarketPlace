describe('Password reset', () => {
    const serverId = 'u0ucxk5n'; 
    const randomId = Cypress._.random(1e6) 
    const testEmail = `signup-${randomId}@${serverId}.mailosaur.net`
    // `signup@u0ucxk5n.mailosaur.net`
    const testPassword = '88888888';
    it('Makes a User Registration request', () => {
        cy.visit('http://localhost:3000/')
        cy.contains('Create Account').click()
        cy.get('input[placeholder*="Username"]').clear().type(testEmail)
        cy.get('input[placeholder*="Password"]').clear().type(testPassword)
        cy.get('input[placeholder*="Email"]').clear().type(testEmail)
        cy.contains('Sign Up').click()
    })
    it('Gets a verification email', () => {
        // 'http://localhost:3000/confirmsignup'
        // http://localhost:3000/SignIn
        cy.mailosaurGetMessage(serverId, {
            sentTo: testEmail,
        })
        .its('html.body')
        .then((html) => {
          cy.document({ log: false }).invoke({ log: false }, 'write', html)
        })})

    // it('Gets a verification email', () => {
    //     cy.mailosaurGetMessage(serverId, {
    //         sentTo: 'testEmail'
    //     }).then((message) => {
    //         cy.log('Message subject:', message.body);
    //   })})
    // it('Gets a Password Reset email', () => {
    //     cy.mailosaurGetMessage(serverId, {
    //         sentTo: testEmail
    //     }).then(email => {
    //         expect(email.subject).to.equal('Reset your password');
    //         passwordResetLink = email.text.links[0].href;
    //     })
    // })

    // it('Follows the link from the email', () => {
    //     const validPassword = 'tlist'

    //     cy.visit(passwordResetLink)
    //     cy.title().should('contain', 'Change your password')
    //     cy.get('#password').type(validPassword)
    //     cy.get('#password_confirmation').type(validPassword)
    //     cy.get('form').submit()
    // })
})
describe('Password reset', () => {
    const serverId = 'u0ucxk5n'; 
    const testEmail = `password-reset@${serverId}.mailosaur.net`

    it('Makes a Password Reset request', () => {
        cy.visit('')
        cy.title().should('equal', 'Forgot your password?')
        cy.get('#email_field').type(testEmail)
    })

    it('Gets a Password Reset email', () => {
        cy.mailosaurGetMessage(serverId, {
            sentTo: testEmail
        }).then(email => {
            expect(email.subject).to.equal('Reset your password');
            passwordResetLink = email.text.links[0].href;
        })
    })

    it('Follows the link from the email', () => {
        const validPassword = 'tlist'

        cy.visit(passwordResetLink)
        cy.title().should('contain', 'Change your password')
        cy.get('#password').type(validPassword)
        cy.get('#password_confirmation').type(validPassword)
        cy.get('form').submit()
    })
})
describe('Login', ()=>{
  beforeEach(()=>{
    cy.login('lxt4399@gmail.com', '88888888')
    // cy.visit('http://localhost:3000/')
    //     cy.contains('Sign In').click()
    //     cy.get('input[placeholder*="Username"]').clear().type('lxt4399@gmail.com')
    //     cy.get('input[placeholder*="Password"]').clear().type('88888888')
    //     cy.contains('Sign In').click()
  }
  )
  it('create tlist', ()=>{
    // cy.visit('http://localhost:3000/')
    cy.contains('Go to your todo lists').click()
    cy.contains('Create').click()
    cy.get('#ListDescription').type('seafood')
    cy.get('#ListTitle').type('fish')
    cy.contains('Submit').click()
    cy.get('.amplify-text').should('contain.text','fish')
  })
})


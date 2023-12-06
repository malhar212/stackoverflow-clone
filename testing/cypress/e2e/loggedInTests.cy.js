describe('Logged In Tests', () => {
    beforeEach(() => {
      // Seed the database before each test
      cy.exec('node ../../../server/init.js');
      // TODO login
    });
    afterEach(() => {
        // TODO logout
        
        // Clear the database after each test
        cy.exec('node ../../../server/destroy.js');
        
    });
    it('passes', () => {
      cy.visit('http://localhost:3000');
    })
  })
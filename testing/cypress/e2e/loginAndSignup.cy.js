beforeEach(() => {
  // Seed the database before each test
  cy.exec('node ../server/init.js');
  console.log("Done insert");
  cy.visit('http://localhost:3000');
  cy.writeFile('logs.txt', `| ${Cypress.currentTest.titlePath[0].padEnd(15)} | ${Cypress.currentTest.titlePath[1].padEnd(90)} |\n`, { flag: 'a+' });
})
afterEach(() => {
  // Clear the database after each test
  cy.exec('node ../server/destroy.js');
  console.log("Done destroy")
});

describe('Welcome Page', () => {

  it('Should contains Login, Signup and Guest buttons', () => {
    cy.contains('button', 'Login').should('exist');
    cy.contains('button', 'Need to Signup?').should('exist');
    cy.contains('button', 'Guest').should('exist');
  })

  it('Should show Login form fields', () => {
    cy.contains('button', 'Login').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="email"]').should('not.exist');
  })

  it('Should show Signup form when Need Signup button click', () => {
    cy.contains('button', 'Need to Signup?').click();
    cy.contains('button', 'Sign Up!').should('exist');
    cy.contains('button', 'Already signed up?').should('exist');
    cy.contains('button', 'Guest').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="confirmPassword"]').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="email"]').should('exist');
  })

  it('Should show Login form again after Already signed up button click', () => {
    cy.contains('button', 'Need to Signup?').click();
    cy.contains('button', 'Already signed up?').should('exist');
    cy.contains('button', 'Already signed up?').click();
    cy.contains('button', 'Login').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="email"]').should('not.exist');
  })

})

describe('Login Page', () => {
  
  it('User doesn\'t input anything', () => {
    cy.contains('button', 'Login').click();
    cy.get('.Toastify__toast-body').should('contain', 'Please fill in all fields');
  });

  it('User doesn\'t input username', () => {
    cy.get('input[name="password"]').type('askdjalskd');
    cy.contains('button', 'Login').click();
    cy.get('.Toastify__toast-body').should('contain', 'Please fill in all fields');
  });

  it('User doesn\'t input password', () => {
    cy.get('input[name="username"]').type('newGuy2');
    cy.contains('button', 'Login').click();
    cy.get('.Toastify__toast-body').should('contain', 'Please fill in all fields');
  });

  it('Check successful login and redirection of a user', () => {
    cy.get('input[name="username"]').type('newGuy2');
    cy.get('input[name="password"]').type('askdjalskdj');
    cy.contains('button', 'Login').click();
    cy.get('.Toastify__toast-body').should('contain', 'Success!');
    cy.contains('All Questions');
  });

  it('User puts invalid password', () => {
    cy.get('input[name="username"]').type('newGuy2');
    cy.get('input[name="password"]').type('askdjalskd');
    cy.contains('button', 'Login').click();
    cy.get('.Toastify__toast-body').should('contain', 'login failed');
  });

  
  it('User doesn\'t exist', () => {
    cy.get('input[name="username"]').type('newG');
    cy.get('input[name="password"]').type('askdjalskd');
    cy.contains('button', 'Login').click();
    cy.get('.Toastify__toast-body').should('contain', 'login failed');
  });

})

describe('Create Account', () => {
  beforeEach(() => {
    cy.contains('button', 'Need to Signup?').click();
  })
  it('User doesn\'t input anything', () => {
    cy.contains('button', 'Sign Up!').click();
    cy.get('.Toastify__toast-body').should('contain', 'Please fill in all fields');
  });

  it('User inputs invalid email', () => {
    cy.get('input[name="username"]').type('newG');
    cy.get('input[name="email"]').type('d@.dd');
    cy.get('input[name="password"]').type('askdjalskd');
    cy.get('input[name="confirmPassword"]').type('askdjalskd');
    cy.contains('button', 'Sign Up!').click();
    cy.get('.Toastify__toast-body').should('contain', 'Please enter a valid email address');
  });

  it('User passwords do not match', () => {
    cy.get('input[name="username"]').type('newG');
    cy.get('input[name="email"]').type('d@d.com');
    cy.get('input[name="password"]').type('askdjalskd');
    cy.get('input[name="confirmPassword"]').type('askdjalskdj');
    cy.contains('button', 'Sign Up!').click();
    cy.get('.Toastify__toast-body').should('contain', 'Passwords do not match');
  });

  it('User passwords should not contain username', () => {
    cy.get('input[name="username"]').type('newG');
    cy.get('input[name="email"]').type('d@d.com');
    cy.get('input[name="password"]').type('askdjanewGlskd');
    cy.get('input[name="confirmPassword"]').type('askdjanewGlskd');
    cy.contains('button', 'Sign Up!').click();
    cy.get('.Toastify__toast-body').should('contain', 'Password cannot contain username or email');
  });

  it('User passwords should not contain email', () => {
    cy.get('input[name="username"]').type('newG');
    cy.get('input[name="email"]').type('d@d.com');
    cy.get('input[name="password"]').type('askdjd@d.comalskd');
    cy.get('input[name="confirmPassword"]').type('askdjd@d.comalskd');
    cy.contains('button', 'Sign Up!').click();
    cy.get('.Toastify__toast-body').should('contain', 'Password cannot contain username or email');
  });

  it('Username already taken', () => {
    cy.get('input[name="username"]').type('newGuy');
    cy.get('input[name="email"]').type('d@d.com');
    cy.get('input[name="password"]').type('askdjalskd');
    cy.get('input[name="confirmPassword"]').type('askdjalskd');
    cy.contains('button', 'Sign Up!').click();
    cy.get('.Toastify__toast-body').should('contain', 'Username is already taken. Please choose another one.');
  });

  it('Email already registered', () => {
    cy.get('input[name="username"]').type('newG');
    cy.get('input[name="email"]').type('samZ@gmail.com');
    cy.get('input[name="password"]').type('askdjalskd');
    cy.get('input[name="confirmPassword"]').type('askdjalskd');
    cy.contains('button', 'Sign Up!').click();
    cy.get('.Toastify__toast-body').should('contain', 'Email is already registered. Please use a different email.');
  });

  it('Successful Registration and redirection to login page and try login with new user', () => {
    cy.get('input[name="username"]').type('newG');
    cy.get('input[name="email"]').type('d@d.com');
    cy.get('input[name="password"]').type('askdjalskd');
    cy.get('input[name="confirmPassword"]').type('askdjalskd');
    cy.contains('button', 'Sign Up!').click();
    cy.get('.Toastify__toast-body').should('contain', 'Success!');
    cy.contains('button', 'Login').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="email"]').should('not.exist');
    cy.get('input[name="username"]').type('newG');
    cy.get('input[name="password"]').type('askdjalskd');
    cy.contains('button', 'Login').click();
    cy.get('.Toastify__toast-body').should('contain', 'Success!');
    cy.contains('All Questions');
  });
})
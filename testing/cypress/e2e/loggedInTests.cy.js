beforeEach(() => {
  // Seed the database before each test
  cy.exec('node ../server/init.js');
  console.log("Done insert");
  cy.visit('http://localhost:3000');
  cy.get('input[name="username"]').type('newGuy2'); // Replace with your username/email
  cy.get('input[name="password"]').type('askdjalskdj');
  cy.contains('button', 'Login').click();
})
afterEach(() => {
  // Clear the database after each test
  cy.exec('node ../server/destroy.js');
  console.log("Done destroy")
});

describe('Home Page', () => {
  // Check all components of Questions page for a logged in user are present

  it('Should show Ask a Question button to LoggedIn user', () => {
    cy.get('#askButton').should('exist');
  });

  it('successfully shows menu options of a Logged In user', () => {
    cy.get('#sideBarNav').contains('Questions');
    cy.get('#sideBarNav').contains('Tags');
    cy.get('#sideBarNav').should('include.text', 'Profile')
    cy.get('#sideBarNav').should('include.text', 'Logout')
  });
})

describe('Answers Page', () => {
  beforeEach(() => {
    cy.contains('Programmatically navigate using React router').click();
  })

  it('Answer Page displays expected header', () => {
    cy.get('#answersHeader').should('contain', 'Programmatically navigate using React router');
    cy.get('#answersHeader').should('contain', '2 answers');
    cy.get('#answersHeader').should('contain', 'Ask a Question');
    cy.get('#sideBarNav').should('contain', 'Questions');
    cy.get('#sideBarNav').should('contain', 'Tags');
  })

  it('Answer Page should show vote buttons to guest', () => {
    cy.get('.vote-component button').should('exist');
  });

  it('Answer Page should show add comment field to guest', () => {
    cy.get('.comment-form').should('exist');
  });

  it('Answer Page should show Add answer button to guest', () => {
    cy.get('#addAnswerBtn').should('exist');
  })

  // Comment related tests

  it('Add a new comment to question', () => {
    const text = ['New Comment'];
    const username = ['newGuy2'];
    const votes = ['0 votes'];
    cy.get('#questionBody').find('.comment-list').should('not.exist');
    cy.get('#questionBody .comment-form input').type('New Comment{enter}');
    cy.get('#questionBody').find('.comment-list').each(($el) => {
      cy.wrap($el).find('.comment').each(($el2, index2) => {
        cy.wrap($el2).should('contain', text[index2]);
        cy.wrap($el2).should('contain', username[index2]);
        cy.wrap($el2).should('contain', votes[index2]);
      })
    })
  })

  it('Add a new comment to answer', () => {
    const text = ['Answer Comment'];
    const username = ['newGuy2'];
    const votes = ['0 votes'];
    cy.contains('.answer', 'On my end, I like to have a single history object ').within(() => {
      cy.get('.comment-list').should('not.exist');
      cy.get('.comment-form input').type('Answer Comment{enter}');
      cy.get('.comment-list .comment').each(($comment, index) => {
        cy.wrap($comment).should('contain', text[index]);
        cy.wrap($comment).should('contain', username[index]);
        cy.wrap($comment).should('contain', votes[index]);
      });
    });
  })

  it('Comment should have only upvote button', () => {
    const text = ['Answer Comment'];
    const username = ['newGuy2'];
    const votes = ['0 votes'];
    cy.contains('.answer', 'On my end, I like to have a single history object ').within(() => {
      cy.get('.comment-list').should('not.exist');
      cy.get('.comment-form input').type('Answer Comment{enter}');
      cy.get('.comment-list .comment').each(($comment, index) => {
        cy.wrap($comment).should('contain', text[index]);
        cy.wrap($comment).should('contain', username[index]);
        cy.wrap($comment).should('contain', votes[index]);
        cy.wrap($comment).within(() => {
          cy.get('.vote-component button .svg-icon.iconArrowUp').should('exist');
          cy.get('.vote-component button .svg-icon.iconArrowDown').should('not.exist');
        });
      });
    });
  })

  it('Adding comment to Question should make Question active ', () => {
    const text = ['New Comment'];
    const username = ['newGuy2'];
    const votes = ['0 votes'];
    cy.get('#questionBody').find('.comment-list').should('not.exist');
    cy.get('#questionBody .comment-form input').type('New Comment{enter}');
    cy.get('#questionBody').find('.comment-list').each(($el) => {
      cy.wrap($el).find('.comment').each(($el2, index2) => {
        cy.wrap($el2).should('contain', text[index2]);
        cy.wrap($el2).should('contain', username[index2]);
        cy.wrap($el2).should('contain', votes[index2]);
      })
    })
    cy.contains('#sideBarNav a', 'Questions').click();
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
    cy.contains('Active').click();
    cy.contains('7 questions');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  })

  it('Adding comment to Answer should make Question active ', () => {
    const text = ['Answer Comment'];
    const username = ['newGuy2'];
    const votes = ['0 votes'];
    cy.contains('.answer', 'On my end, I like to have a single history object ').within(() => {
      cy.get('.comment-list').should('not.exist');
      cy.get('.comment-form input').type('Answer Comment{enter}');
      cy.get('.comment-list .comment').each(($comment, index) => {
        cy.wrap($comment).should('contain', text[index]);
        cy.wrap($comment).should('contain', username[index]);
        cy.wrap($comment).should('contain', votes[index]);
      });
    });
    cy.contains('#sideBarNav a', 'Questions').click();
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
    cy.contains('Active').click();
    cy.contains('7 questions');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  })
})
beforeEach(() => {
  // Seed the database before each test
  cy.exec('node ../server/init.js');
  console.log("Done insert");
  cy.visit('http://localhost:3000');
  cy.get('input[name="username"]').type('newGuy2');
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
    const text = 'New Comment';
    const username = 'newGuy2';
    const votes = '0 votes';
    cy.get('#questionBody').find('.comment-list').should('not.exist');
    cy.get('#questionBody .comment-form input').type('New Comment{enter}');
    cy.get('#questionBody').find('.comment-list').each(($el) => {
      cy.wrap($el).find('.comment').first(($el2, index2) => {
        cy.wrap($el2).should('contain', text);
        cy.wrap($el2).should('contain', username);
        cy.wrap($el2).should('contain', votes);
      })
    })
  })

  it('Add a new comment to answer', () => {
    const text = 'Answer Comment';
    const username = 'newGuy2';
    const votes = '0 votes';
    cy.contains('.answer', 'On my end, I like to have a single history object ').within(() => {
      cy.get('.comment-list').should('not.exist');
      cy.get('.comment-form input').type('Answer Comment{enter}');
      cy.get('.comment-list .comment').first(($comment, index) => {
        cy.wrap($comment).should('contain', text);
        cy.wrap($comment).should('contain', username);
        cy.wrap($comment).should('contain', votes);
      });
    });
  })

  it('Comment should have only upvote button', () => {
    const text = 'Answer Comment';
    const username = 'newGuy2';
    const votes = '0 votes';
    cy.contains('.answer', 'On my end, I like to have a single history object ').within(() => {
      cy.get('.comment-list').should('not.exist');
      cy.get('.comment-form input').type('Answer Comment{enter}');
      cy.get('.comment-list .comment').first(($comment, index) => {
        cy.wrap($comment).should('contain', text);
        cy.wrap($comment).should('contain', username);
        cy.wrap($comment).should('contain', votes);
        cy.wrap($comment).within(() => {
          cy.get('.vote-component button .svg-icon.iconArrowUp').should('exist');
          cy.get('.vote-component button .svg-icon.iconArrowDown').should('not.exist');
        });
      });
    });
  })

  it('Adding comment to Question should make Question active ', () => {
    const text = 'New Comment';
    const username = 'newGuy2';
    const votes = '0 votes';
    cy.get('#questionBody').find('.comment-list').should('not.exist');
    cy.get('#questionBody .comment-form input').type('New Comment{enter}');
    cy.get('#questionBody .comment-list .comment').first(($el2) => {
      cy.wrap($el2).should('contain', text);
      cy.wrap($el2).should('contain', username);
      cy.wrap($el2).should('contain', votes);
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
    const text = 'Answer Comment';
    const username = 'newGuy2';
    const votes = '0 votes';
    cy.contains('.answer', 'On my end, I like to have a single history object ').within(() => {
      cy.get('.comment-list').should('not.exist');
      cy.get('.comment-form input').type('Answer Comment{enter}');
      cy.get('.comment-list .comment').first(($comment, index) => {
        cy.wrap($comment).should('contain', text);
        cy.wrap($comment).should('contain', username);
        cy.wrap($comment).should('contain', votes);
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

  it('User does not see accept answer button on other user\'s questions', () => {
    cy.get('button').contains('Accept Answer').should('not.exist');
    cy.contains('#sideBarNav a', 'Questions').click();
  })

  it('User does not see accept answer button on own question with already accepted answer', () => {
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('newGuy');
    cy.get('input[name="password"]').type('passExample');
    cy.contains('button', 'Login').click();
    cy.contains('android studio save string shared preference, start activity and load the saved string').click();
    cy.get('button').contains('Accept Answer').should('not.exist');
  })

  it('User sees accept answer button on own question', () => {
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('samZ');
    cy.get('input[name="password"]').type('examplePass');
    cy.contains('button', 'Login').click();
    cy.contains('Programmatically navigate using React router').click();
    cy.get('button').contains('Accept Answer').should('exist');
  })

  it('User accepts answer should mark pin the accepted answer to top', () => {
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('samZ');
    cy.get('input[name="password"]').type('examplePass');
    cy.contains('button', 'Login').click();
    cy.contains('Programmatically navigate using React router').click();
    // Before
    const answers = ['On my end, I like to have a single history object that I can carry even outside components.', 'React Router is mostly a wrapper around the history library.'];
    cy.get('.answerText').each(($el, index) => {
      cy.wrap($el).should('contain', answers[index]);
    });
    cy.contains('.answer', 'React Router is mostly a wrapper around the history library.').within(() => {
      cy.get('button').contains('Accept Answer').click();
    })
    // After
    const answersAfter = ['React Router is mostly a wrapper around the history library.', 'On my end, I like to have a single history object that I can carry even outside components.'];
    cy.get('.answerText').each(($el, index) => {
      cy.wrap($el).should('contain', answersAfter[index]);
    });
  })

  it('User accepts answer should mark the question active', () => {
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('samZ');
    cy.get('input[name="password"]').type('examplePass');
    cy.contains('button', 'Login').click();
    cy.contains('Programmatically navigate using React router').click();
    cy.contains('.answer', 'React Router is mostly a wrapper around the history library.').within(() => {
      cy.get('button').contains('Accept Answer').click();
    })
    // After
    cy.contains('#sideBarNav a', 'Questions').click();
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
    cy.contains('Active').click();
    cy.contains('7 questions');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  })

  it('User with low reputation cannot vote on Question', () => {
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('samZ');
    cy.get('input[name="password"]').type('examplePass');
    cy.contains('button', 'Login').click();
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('Programmatically navigate using React router').click();
    cy.get('.Toastify__toast-body').should('not.exist');
    cy.get('#questionBody').within(() => { cy.get('.vote-component button .svg-icon.iconArrowUp').first().click() });
    cy.get('.Toastify__toast-body').should('contain', 'You need atleast 50 reputation to vote');
    cy.get('button.Toastify__close-button.Toastify__close-button--colored').click({ force: true });
    cy.get('.Toastify__toast-body').should('not.exist');
    cy.get('#questionBody').within(() => { cy.get('.vote-component button .svg-icon.iconArrowDown').first().click() });
    cy.get('.Toastify__toast-body').should('contain', 'You need atleast 50 reputation to vote');
  })

  it('User with low reputation cannot vote on Answer', () => {
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('samZ');
    cy.get('input[name="password"]').type('examplePass');
    cy.contains('button', 'Login').click();
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('Programmatically navigate using React router').click();
    cy.get('div .Toastify__toast-body').should('not.exist');
    cy.get('.answer').first().within(() => {
      cy.get('.vote-component button .svg-icon.iconArrowUp').first().click();
    })
    cy.get('div .Toastify__toast-body').should('contain', 'You need atleast 50 reputation to vote');
      cy.get('button.Toastify__close-button.Toastify__close-button--colored').click({ force: true });
      cy.get('div .Toastify__toast-body').should('not.exist');
    cy.get('.answer').first().within(() => {
      cy.get('.vote-component button .svg-icon.iconArrowDown').first().click();
    })
    cy.get('div .Toastify__toast-body').should('contain', 'You need atleast 50 reputation to vote');
  })

  it('User with low reputation cannot vote on Comment', () => {
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('samZ');
    cy.get('input[name="password"]').type('examplePass');
    cy.contains('button', 'Login').click();
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('android studio save string shared preference').click();
    cy.get('div .Toastify__toast-body').should('not.exist');
    cy.get('.comment').first().within(() => {
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
    })
    cy.get('div .Toastify__toast-body').should('contain', 'You need atleast 50 reputation to vote');
  })

  it('Upvoting Question increments by 1', () => {
    cy.get('#questionBody').within(() => {
      cy.get('div .Toastify__toast-body').should('not.exist');
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
      cy.get('.vote-component').should('contain', '11 votes');
    })
  })

  it('Downvoting Question decrements by 1', () => {
    cy.get('#questionBody').within(() => {
      cy.get('div .Toastify__toast-body').should('not.exist');
      cy.get('.vote-component button .svg-icon.iconArrowDown').click();
      cy.get('.vote-component').should('contain', '9 votes');
    })
  })


  it('Upvoting an Answer increments by 1', () => {
    cy.get('.answer').first().within(() => {
      cy.get('div .Toastify__toast-body').should('not.exist');
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
      cy.get('.vote-component').should('contain', '21 votes');
    })
  })

  it('Downvoting an Answer decrements by 1', () => {
    cy.get('.answer').first().within(() => {
      cy.get('div .Toastify__toast-body').should('not.exist');
      cy.get('.vote-component button .svg-icon.iconArrowDown').click();
      cy.get('.vote-component').should('contain', '19 votes');
    })
  })

  it('Upvoting a Comment on a Question increments by 1', () => {
    cy.get('.comment').first().within(() => {
      cy.get('div .Toastify__toast-body').should('not.exist');
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
      cy.get('.vote-component').should('contain', '1 votes');
    })
  })

  it('Upvoting a Comment on An answer increments by 1', () => {
    cy.get('.answer .comment').first().within(() => {
      cy.get('div .Toastify__toast-body').should('not.exist');
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
      cy.get('.vote-component').should('contain', '11 votes');
    })
  })

  it('Upvoting Question makes it active', () => {
    cy.get('#questionBody').within(() => {
      cy.get('div .Toastify__toast-body').should('not.exist');
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
    })
    cy.contains('#sideBarNav a', 'Questions').click();
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
    cy.contains('Active').click();
    cy.contains('7 questions');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  })

  it('Downvoting Question makes it active', () => {
    cy.get('#questionBody').within(() => {
      cy.get('div .Toastify__toast-body').should('not.exist');
      cy.get('.vote-component button .svg-icon.iconArrowDown').click();
    })
    cy.contains('#sideBarNav a', 'Questions').click();
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
    cy.contains('Active').click();
    cy.contains('7 questions');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  })


  it('Upvoting an Answer makes corresponding Question active', () => {
    cy.get('.answer').first().within(() => {
      cy.get('div .Toastify__toast-body').should('not.exist');
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
    })
    cy.contains('#sideBarNav a', 'Questions').click();
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
    cy.contains('Active').click();
    cy.contains('7 questions');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  })

  it('Downvoting an Answer makes corresponding Question makes it active', () => {
    cy.get('.answer').first().within(() => {
      cy.get('div .Toastify__toast-body').should('not.exist');
      cy.get('.vote-component button .svg-icon.iconArrowDown').click();
    })
    cy.contains('#sideBarNav a', 'Questions').click();
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
    cy.contains('Active').click();
    cy.contains('7 questions');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  })

  it('Upvoting a Comment makes corresponding Question active', () => {
    cy.get('.comment').first().within(() => {
      cy.get('div .Toastify__toast-body').should('not.exist');
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
    })
    cy.contains('#sideBarNav a', 'Questions').click();
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
    cy.contains('Active').click();
    cy.contains('7 questions');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  })

  it('Upvoting a Comment on An answer makes corresponding Question active', () => {
    cy.get('.answer .comment').first().within(() => {
      cy.get('div .Toastify__toast-body').should('not.exist');
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
    })
    cy.contains('#sideBarNav a', 'Questions').click();
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
    cy.contains('Active').click();
    cy.contains('7 questions');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  })

  it('Upvoting Question increments corresponding user reputation by 5', () => {
    cy.get('#questionBody').within(() => {
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
    })
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('samZ');
    cy.get('input[name="password"]').type('examplePass');
    cy.contains('button', 'Login').click();
    cy.contains('#sideBarNav a', 'Profile').click();
    cy.get('.profilePageUserBanner').contains('Your reputation is: 5');
  })

  it('Downvoting Question decrements corresponding user reputation by 10', () => {
    cy.get('#questionBody').within(() => {
      cy.get('.vote-component button .svg-icon.iconArrowDown').click();
    })
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('samZ');
    cy.get('input[name="password"]').type('examplePass');
    cy.contains('button', 'Login').click();
    cy.contains('#sideBarNav a', 'Profile').click();
    cy.get('.profilePageUserBanner').contains('Your reputation is: -10');
  })

  it('Upvoting an Answer increments corresponding user reputation by 5', () => {
    cy.get('.answer').first().within(() => {
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
    })
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('newGuy');
    cy.get('input[name="password"]').type('passExample');
    cy.contains('button', 'Login').click();
    cy.contains('#sideBarNav a', 'Profile').click();
    cy.get('.profilePageUserBanner').contains('Your reputation is: 65');
  })

  it('Downvoting an Answer decrements corresponding user reputation by 10', () => {
    cy.get('.answer').first().within(() => {
      cy.get('.vote-component button .svg-icon.iconArrowDown').click();
    })
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('newGuy');
    cy.get('input[name="password"]').type('passExample');
    cy.contains('button', 'Login').click();
    cy.contains('#sideBarNav a', 'Profile').click();
    cy.get('.profilePageUserBanner').contains('Your reputation is: 50');
  })

  it('Upvoting a Comment has no impact on user reputation', () => {
    cy.get('.comment').first().within(() => {
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
    })
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('newGuy');
    cy.get('input[name="password"]').type('passExample');
    cy.contains('button', 'Login').click();
    cy.contains('#sideBarNav a', 'Profile').click();
    cy.get('.profilePageUserBanner').contains('Your reputation is: 60');
  })

  it('Upvoting a Comment on An answer has no impact on user reputation', () => {
    cy.get('.answer .comment').first().within(() => {
      cy.get('.vote-component button .svg-icon.iconArrowUp').click();
    })
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('newGuy');
    cy.get('input[name="password"]').type('passExample');
    cy.contains('button', 'Login').click();
    cy.contains('#sideBarNav a', 'Profile').click();
    cy.get('.profilePageUserBanner').contains('Your reputation is: 60');
  })

})
beforeEach(() => {
  // Seed the database before each test
  cy.exec('node ../server/init.js');
  console.log("Done insert");
  cy.visit('http://localhost:3000');
  cy.writeFile('logs.txt', `| ${Cypress.currentTest.titlePath[0].padEnd(15)} | ${Cypress.currentTest.titlePath[1].padEnd(90)} |\n`, { flag: 'a+' });
  cy.get('input[name="username"]').type('newGuy2');
  cy.get('input[name="password"]').type('askdjalskdj');
  cy.contains('button', 'Login').click();
})
afterEach(() => {
  // Clear the database after each test
  cy.exec('node ../server/destroy.js');
  console.log("Done destroy")
});

describe('Add Question Page', () => {
  beforeEach(() => {
    cy.get('#askButton').click();
  })

  // checks components of add question page 
  it('Should show question form.', () => {
    cy.get('#questionForm').should('exist');
  });


  it('Should have question text form input', () => {
    cy.get('#formTextInput').should('exist');
  });


  it('Should have question text form input', () => {
    cy.get('#formTitleInput').should('exist');
  });

  it('Should have question text form input', () => {
    cy.get('#formTagInput').should('exist');
  });

  it('Should contain Ask a Question Text', () => {
    cy.get('.form h1').should('contain', 'Ask a Question');
  })

  // Submit the form
  it('Submits form with all empty fields', () => {
    cy.get('button#postQuestionButton').click();
    cy.get('#titleError').should('contain', 'Title cannot be empty');
    cy.get('#textError').should('contain', 'Question text cannot be empty');
  });

  // Entering text over 100 characters should raise error
  it('displays an error for title with over 100 characters', () => {
    const longTitle = '0'.repeat(101);
    cy.get('input[name="title"]').type(longTitle);
    cy.get('#postQuestionButton').click();
    cy.get('#titleError').should('contain', 'Title cannot be more than 100 characters');
  });

  // Entering text over 100 characters should raise error
  it('displays an error for title with over 100 characters w/ correct QuestionText', () => {
    const longTitle = '0'.repeat(101);
    cy.get('input[name="title"]').type(longTitle);
    cy.get('#formTextInput').type("I am an acceptable question text");
    cy.get('#postQuestionButton').click();
    cy.get('#titleError').should('contain', 'Title cannot be more than 100 characters');
  });


  it('creates only one instance of a tag if entered several times', () => {
    cy.get('#formTitleInput').type('Test Question 1');
    cy.get('#formTextInput').type('Test Question 1 Text');
    // Enter the same tag multiple times into the tags input
    const duplicateTag = 'cypresstag';
    cy.get('#formTagInput').type(`${duplicateTag} ${duplicateTag} ${duplicateTag}`);
    // Submit the form
    cy.contains('Post Question').click();
    // Check that only one instance of the tag is created
    cy.contains('cypresstag');
  });

  it('tag text converted to lower case', () => {
    cy.get('#formTitleInput').type('Test Question 1');
    cy.get('#formTextInput').type('Test Question 1 Text');
    // Enter the same tag multiple times into the tags input
    const duplicateTag = 'cypressTag';
    cy.get('#formTagInput').type(`${duplicateTag} ${duplicateTag} ${duplicateTag}`);
    // Submit the form
    cy.contains('Post Question').click();
    // Check that only one instance of the tag is created
    cy.contains('cypresstag');
  });

  it('Ask a Question creates and displays in All Questions', () => {
    cy.get('#formTitleInput').type('Test Question 1');
    cy.get('#formTextInput').type('Test Question 1 Text');
    cy.get('#formTagInput').type('javascript');
    cy.contains('Post Question').click();
    cy.contains('Fake Stack Overflow');
    const qTitles = ['Test Question 1', 'Programmatically navigate using React router', 'android studio save string shared preference', 'Question 5', 'Question 4'];
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    });
  })

  it('Ask a Question creates and displays expected meta data in Unanswered', () => {
    cy.get('#formTitleInput').type('Test Question 1');
    cy.get('#formTextInput').type('Test Question 1 Text');
    cy.get('#formTagInput').type('javascript');
    cy.contains('Post Question').click();
    cy.contains('Fake Stack Overflow');
    cy.contains('8 questions');
    cy.contains('newGuy2 asked 0 seconds ago');
    const answers = ['0 answers', '2 answers', '7 answers', '0 answers', '0 answers'];
    const views = ['0 views', '0 views', '121 views', '14 views', '141 views' ];
    cy.get('.postStats').each(($el, index, $list) => {
      cy.wrap($el).should('contain', answers[index]);
      cy.wrap($el).should('contain', views[index]);
    });
    cy.contains('Unanswered').click();
    cy.get('.postTitle').should('have.length', 5);
    cy.get('.postTitle').first().should('contain', 'Test Question 1');
    cy.contains('6 question');
  })

  it('Ask a Question creates new question and shows up in Active order', () => {
    cy.get('#formTitleInput').type('Test Question 1');
    cy.get('#formTextInput').type('Test Question 1 Text');
    cy.get('#formTagInput').type('javascript');
    cy.contains('Post Question').click();
    cy.contains('Fake Stack Overflow');
    cy.contains('8 questions');
    cy.contains('newGuy2 asked 0 seconds ago');
    const answers = ['0 answers', '2 answers', '7 answers', '0 answers', '0 answers'];
    const views = ['0 views', '0 views', '121 views', '14 views', '141 views' ];
    cy.get('.postStats').each(($el, index, $list) => {
      cy.wrap($el).should('contain', answers[index]);
      cy.wrap($el).should('contain', views[index]);
    });
    cy.contains('Active').click();
    cy.get('.postTitle').should('have.length', 5);
    cy.get('.postTitle').first().should('contain', 'Test Question 1');
    cy.contains('8 question');
  })

  it('Ask a Question creates and displays in All Questions with necessary tags', () => {
    cy.get('#formTitleInput').type('Test Question 1');
    cy.get('#formTextInput').type('Test Question 1 Text');
    cy.get('#formTagInput').type('javascript t1 t2');
    cy.contains('Post Question').click();
    cy.contains('Fake Stack Overflow');
    cy.contains('javascript');
    cy.contains('t1');
    cy.contains('t2');
  })

  it('Ask a Question creates and displays in All Questions with necessary tags', () => {
    cy.get('#formTitleInput').type('Test Question 1');
    cy.get('#formTextInput').type('Test Question 1 Text');
    cy.get('#formTagInput').type('javascript t1 t2');
    cy.contains('Post Question').click();
    cy.contains('Fake Stack Overflow');
    cy.contains('javascript');
    cy.contains('android-studio');
    cy.contains('t2');
  })

  it('Ask a Question with empty title shows error', () => {
    cy.get('#formTextInput').type('Test Question 1 Text');
    cy.get('#formTagInput').type('javascript');
    cy.contains('Post Question').click();
    cy.contains('Title cannot be empty');
  })

  it('Ask a Question with long title shows error', () => {
    cy.get('#formTitleInput').type('Test Question 0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
    cy.get('#formTextInput').type('Test Question 1 Text');
    cy.get('#formTagInput').type('javascript');
    cy.contains('Post Question').click();
    cy.contains('Title cannot be more than 100 characters');
  })

  it('Ask a Question with empty text shows error', () => {
    cy.get('#formTitleInput').type('Test Question 1');
    cy.get('#formTagInput').type('javascript');
    cy.contains('Post Question').click();
    cy.contains('Question text cannot be empty');
  })

  it('Ask a Question with more than 5 tags shows error', () => {
    cy.get('#formTitleInput').type('Test Question 1');
    cy.get('#formTextInput').type('Test Question 1 Text');
    cy.get('#formTagInput').type('t1 t2 t3 t4 t5 t6');
    cy.contains('Post Question').click();
    cy.contains('Cannot have more than 5 tags');
  })

  it('Ask a Question with a long new tag', () => {
    cy.get('#formTitleInput').type('Test Question 1');
    cy.get('#formTextInput').type('Test Question 1 Text');
    cy.get('#formTagInput').type('t1 t2 t3t4t5t6t7t8t9t3t4t5t6t7t8t9');
    cy.contains('Post Question').click();
    cy.contains('New tag length cannot be more than 20');
  })




  // END OF ADD QUESTION PAGE TESTS
})







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

describe('User Profile', () => {
  beforeEach(() => {
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('newGuy');
    cy.get('input[name="password"]').type('passExample');
    cy.contains('button', 'Login').click();
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.get('#sideBarNav a').contains('Profile').click();
  });

  it('Successfully shows info and options of a Logged In user on Profile Page', () => {
    cy.contains('.profilePageUserBanner h1', 'Welcome newGuy!').should('exist');
    cy.contains('.profilePageUserBanner span', 'Your reputation is: 60').should('exist');
    cy.contains('.profilePageUserBanner span', 'Your account was created 420 day(s) ago.').should('exist');
    cy.get('#profileAnswersButton').should('exist');
    cy.get('#profileQuestionsButton').should('exist');
    cy.get('#profileTagsButton').should('exist');
  })

  it('Successfully shows users answers correctly', () => {
    cy.get('#profileAnswersButton').click();
    const expectedTitles = [
      "On my end, I like to have a single history object  ...",
      "I just found all the above examples just too confu ...",
      "Answer 5",
    ];
    cy.get('.profileContent li a').each(($a, index) => {
      cy.wrap($a).invoke('text').should('contain', expectedTitles[index]);
    });
  })

  it('Successfully shows users questions correctly', () => {
    cy.get('#profileQuestionsButton').click();
    const expectedTitles = [
      "android studio save string shared preference, star ...",
      "Question 5",
      "Question 4",
      "Question 2",
      "Question 1",
    ];
    cy.get('.profileContent li a').each(($a, index) => {
      cy.wrap($a).invoke('text').should('contain', expectedTitles[index]);
    });
  })

  it('Successfully shows users tags correctly', () => {
    cy.get('#profileTagsButton').click();
    const tagNames = ['android-studio', 'shared-preferences'];
    const tagCounts = ['3 question', '4 question'];
    const buttonsState = [false, true];
    cy.get('.tagNode').each(($el, index, $list) => {
      cy.wrap($el).should('contain', tagNames[index]);
      cy.wrap($el).should('contain', tagCounts[index]);
      cy.wrap($el).find('button').eq(0).should(buttonsState[index] ? 'not.be.disabled' : 'be.disabled');
      cy.wrap($el).find('button').eq(1).should(buttonsState[index] ? 'not.be.disabled' : 'be.disabled');
    })
  })
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

  it('User with low reputation cannot Add a new comment', () => {
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('samZ');
    cy.get('input[name="password"]').type('examplePass');
    cy.contains('button', 'Login').click();
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('Programmatically navigate using React router').click();
    cy.get('#questionBody .comment-form input').type('New Comment{enter}');
    cy.get('#textError').should('have.text', "You don't have enough reputation to comment");
  })

  it('User cannot Add a empty comment', () => {
    cy.get('#questionBody .comment-form input').type('{enter}');
    cy.get('#textError').should('have.text', "Comment text cannot be empty");
  })

  it('User cannot Add a comment longer than 140 characters', () => {
    cy.get('#questionBody .comment-form input').type('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.{enter}');
    cy.get('#textError').should('have.text', "Comment cannot be more than 140 characters");
  })

  // TODO invalid hyperlink test

  it('Add a new comment to question', () => {
    const text = 'New Comment';
    const username = 'newGuy2';
    const votes = '0 votes';
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
      cy.get('.vote-component button .svg-icon.iconArrowUp').first().click();
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
      cy.get('.vote-component button .svg-icon.iconArrowDown').first().click();
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

describe('Editing/Deleting Tags', () => {
  beforeEach(() => {
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('newGuy');
    cy.get('input[name="password"]').type('passExample');
    cy.contains('button', 'Login').click();
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.get('#sideBarNav a').contains('Profile').click();
    cy.get('#profileTagsButton').click();
  });

  it('Make sure tags in use by other users are not editable', () => {
    const tagNames = ['android-studio', 'shared-preferences'];
    const tagCounts = ['3 question', '4 question'];
    const buttonsState = [false, true];
    cy.get('.tagNode').each(($el, index, $list) => {
      cy.wrap($el).should('contain', tagNames[index]);
      cy.wrap($el).should('contain', tagCounts[index]);
      cy.wrap($el).find('button').eq(0).should(buttonsState[index] ? 'not.be.disabled' : 'be.disabled');
      cy.wrap($el).find('button').eq(1).should(buttonsState[index] ? 'not.be.disabled' : 'be.disabled');
    })
  })

  it('Deleting tag deletes it from all questions', () => {
    cy.contains('.tagNode', 'shared-preference')
      .find('button:contains("Delete")')
      .click();
    cy.contains('.tagNode', 'shared-preference').should('not.exist');
    cy.get('#sideBarNav a').contains('Questions').click();
    cy.contains('.pill', 'shared-preference').should('not.exist');
  })

  it('Editing tag updates it for all questions', () => {
    cy.contains('.tagNode', 'shared-preference')
      .find('button:contains("Edit")')
      .click();
    cy.get('#content textarea').should('have.value', 'shared-preferences');
    cy.get('#content textarea').clear().type('new-tag-name');
    cy.get('#content button[type="submit"]').click();
    cy.get('#profileTagsButton').click();
    cy.contains('.tagNode', 'shared-preference').should('not.exist');
    cy.contains('.tagNode', 'new-tag-name').should('exist');
    cy.get('#sideBarNav a').contains('Questions').click();
    cy.contains('.pill', 'shared-preference').should('not.exist');
    cy.contains('.pill', 'new-tag-name').should('exist');
  })

  it('Empty tag name is rejected', () => {
    cy.contains('.tagNode', 'shared-preference')
      .find('button:contains("Edit")')
      .click();
    cy.get('#content textarea').should('have.value', 'shared-preferences');
    cy.get('#content textarea').clear();
    cy.get('#content button[type="submit"]').click();
    cy.get('.Toastify__toast-body').should('contain', 'Tag Name should not be empty');
    cy.get('#sideBarNav a').contains('Profile').click();
    cy.get('#profileTagsButton').click();
    cy.contains('.tagNode', 'shared-preference').should('exist');
    cy.get('#sideBarNav a').contains('Questions').click();
    cy.contains('.pill', 'shared-preference').should('exist');
  })
})

describe('Add Answer', () => {
  beforeEach(() => {
    cy.contains('Programmatically navigate using React router').click();
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
  })

  it('Create new answer should be displayed at the top of the answers page', () => {
    const answers = ["Test Answer 1", "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.", "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node."];
    cy.contains('Answer Question').click();
    cy.get('#answerTextInput').type(answers[0]);
    cy.contains('Post Answer').click();
    cy.get('.answerText').each(($el, index) => {
      cy.wrap($el).should('contain', answers[index]);
    });
    cy.contains('newGuy');
    cy.contains('0 seconds ago');
    cy.get('.answer').first().within(() => {
      cy.get('.vote-component').should('contain', '0 votes');
    })
  });

  it('Answer is mandatory when creating a new answer', () => {
    cy.contains('Answer Question').click();
    cy.contains('Post Answer').click();
    cy.contains('Answer text cannot be empty');
  });

  it('Adds an answer with a hyperlink and verifies', () => {
    const answers = ['Check this link for more info: [Documentation](https://docs.example.com)', "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.", "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node."];
    cy.contains('Answer Question').click();
    cy.get('#answerTextInput').type('Check this link for more info: [Documentation](https://docs.example.com)');
    cy.contains('Post Answer').click();
    cy.get('.answerText').first().within(() => {
      cy.get('a').should('have.attr', 'href', 'https://docs.example.com');
    });
    cy.contains('newGuy');
    cy.contains('0 seconds ago');
  });

  it('Attempts to add an answer with an invalid hyperlink and verifies failure', () => {
    cy.contains('Answer Question').click();
    cy.get('#answerTextInput').type('Check this invalid link: [](https://wrong.url)');
    cy.contains('Post Answer').click();
    cy.contains('Invalid hyperlink');
    cy.get('#sideBarNav a').contains('Questions').click();
    cy.contains('Programmatically navigate using React router').click();
    cy.get('.answerText').should('not.contain', 'https://wrong.url');
  });

  it('Create new answer marks the question active', () => {
    const answers = ["Test Answer 1", "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.", "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node."];
    cy.contains('Answer Question').click();
    cy.get('#answerTextInput').type(answers[0]);
    cy.contains('Post Answer').click();
    cy.get('.answerText').each(($el, index) => {
      cy.wrap($el).should('contain', answers[index]);
    });
    cy.contains('newGuy');
    cy.contains('0 seconds ago');
    cy.contains('#sideBarNav a', 'Questions').click();
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
    cy.contains('Active').click();
    cy.contains('7 questions');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  });
})


describe('Edit/Delete Answer', () => {
  beforeEach(() => {
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.contains('#sideBarNav a', 'Logout').click();
    cy.get('input[name="username"]').type('newGuy');
    cy.get('input[name="password"]').type('passExample');
    cy.contains('button', 'Login').click();
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    cy.get('#sideBarNav a').contains('Profile').click();
    cy.get('#profileAnswersButton').click();
  });

  it('Deleting answer should remove answer from profile. Should not affect user reputation', () => {
    cy.get('.profileContent li a').first().click();
    cy.get('h1').contains('Edit Answer').should('exist');
    cy.contains('button', 'Delete Answer').should('exist').click();
    cy.contains('.profilePageUserBanner span', 'Your reputation is: 60').should('exist');
    cy.get('#profileAnswersButton').click();
    const expectedTitles = [
      "I just found all the above examples just too confu ...",
      "Answer 5",
    ];
    cy.get('.profileContent li a').each(($a, index) => {
      cy.wrap($a).invoke('text').should('contain', expectedTitles[index]);
    });
  });

  it('Deleting answer should mark question active', () => {
    cy.get('.profileContent li a').first().click();
    cy.get('h1').contains('Edit Answer').should('exist');
    cy.contains('button', 'Delete Answer').should('exist').click();
    cy.contains('.profilePageUserBanner span', 'Your reputation is: 60').should('exist');
    cy.contains('#sideBarNav a', 'Questions').click();
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
    cy.contains('Active').click();
    cy.contains('7 questions');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  });

  it('Answer is mandatory when editing new answer', () => {
    cy.get('.profileContent li a').first().click();
    cy.get('form').should('exist');
    cy.get('textarea').should('exist').clear();
    cy.get('button[type="submit"]').should('exist').click();
    cy.contains('Answer text cannot be empty');
  });

  it('Edit an answer with a hyperlink and verifies', () => {
    cy.get('.profileContent li a').first().click();
    const answers = ['Check this link for more info: [Documentation](https://docs.example.com)', "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.", "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node."];
    cy.get('textarea').should('exist').clear().type('Check this link for more info: [Documentation](https://docs.example.com)');
    cy.get('button[type="submit"]').should('exist').click();
    cy.contains('#sideBarNav a', 'Questions').click();
    cy.contains('Programmatically navigate using React router').click();
    cy.get('.answerText').first().within(() => {
      cy.get('a').should('have.attr', 'href', 'https://docs.example.com');
    });
  });

  it('Attempts to update answer with an invalid hyperlink and verifies failure', () => {
    cy.get('.profileContent li a').first().click();
    cy.get('textarea').should('exist').clear().type('Check this invalid link: [](https://wrong.url)');
    cy.get('button[type="submit"]').should('exist').click();
    cy.contains('Invalid hyperlink');
  });

  it('Editing an answer marks the question active', () => {
    cy.get('.profileContent li a').first().click();
    const answers = ['Check this link for more info: [Documentation](https://docs.example.com)', "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.", "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node."];
    cy.get('textarea').should('exist').clear().type('Check this link for more info: [Documentation](https://docs.example.com)');
    cy.get('button[type="submit"]').should('exist').click();
    cy.contains('#sideBarNav a', 'Questions').click();
    const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
    cy.contains('Active').click();
    cy.contains('7 questions');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  });
})

describe('Editing / Deleting Questions', () => {
  beforeEach(() => {
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    // logging out
    cy.contains('#sideBarNav a', 'Logout').click();
    // logging in to edit / delete questions
    cy.get('input[name="username"]').type('newGuy');
    cy.get('input[name="password"]').type('passExample');
    cy.contains('button', 'Login').click();
    cy.get('button[class^="Toastify__close-button"]').click({ multiple: true });
    // navigate to profile page to edit questions
    cy.get('#sideBarNav a').contains('Profile').click();
    cy.get('#profileQuestionsButton').click();
  });

  it('Deleting question should delete from profile page', () => {
    cy.get('.profileContent li a').first().click();
    cy.get('h1').contains('Edit Question').should('exist');
    // should contain text populated from current question state
    cy.get('textarea').contains('I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.')
    // deleting the question
    cy.contains('button', 'Delete Question').should('exist').click();
    cy.get('#profileQuestionsButton').click();
    // remaining questions
    const expectedTitles = [
      'Question 5',
      'Question 4', 
      'Question 2', 
      'Question 1'
    ];
    cy.get('.profileContent li a').each(($a, index) => {
      cy.wrap($a).invoke('text').should('contain', expectedTitles[index]);
    });
  });
})
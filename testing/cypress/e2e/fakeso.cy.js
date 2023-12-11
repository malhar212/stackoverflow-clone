before(() => {// Clear the database after each test
    cy.exec('node ../server/destroy.js');
    console.log("Done destroy")
})
beforeEach(() => {
    // Seed the database before each test
    cy.exec('node ../server/init.js');
    console.log("Done insert");
    cy.visit('http://localhost:3000');
    // cy.writeFile('logs.txt', `| ${Cypress.currentTest.titlePath[0].padEnd(15)} | ${Cypress.currentTest.titlePath[1].padEnd(90)} |\n`, { flag: 'a+' });
    const testTitle = Cypress.currentTest.titlePath
        .map((title, index) => (index === 0 ? title : title.padEnd(90)))
        .join(' | ');
    cy.writeFile('logs.txt', `| ${testTitle} |\n`, { flag: 'a+' });

    cy.contains('Guest').click();
})
afterEach(() => {
    // Clear the database after each test
    cy.exec('node ../server/destroy.js');
    console.log("Done destroy")
});

describe('Home Page', () => {

    // Check all components of Questions page are present

    it('Successfully shows All Questions string', () => {
        cy.contains('All Questions');
    });

    it('Should not show Ask a Question button to Guest', () => {
        cy.get('#askButton').should('not.exist');
    });

    it('successfully shows menu items', () => {
        cy.get('#sideBarNav').contains('Questions');
        cy.get('#sideBarNav').contains('Tags');
    });

    // Check that user is not logged in and there are no add question, profile and logout buttons
    it('Should not show options of a Logged In user', () => {
        cy.get('#sideBarNav').should('not.include.text', 'Profile')
        cy.get('#sideBarNav').should('not.include.text', 'Logout')
    });

    it('successfully shows total questions number', () => {
        cy.contains('7 questions');
    });

    it('successfully shows filter buttons', () => {
        cy.contains('Newest');
        cy.contains('Active');
        cy.contains('Unanswered');
    });

    it('successfully shows search bar', () => {
        cy.get('#searchBar');
    })

    it('successfully shows page title', () => {
        cy.get('.banner').contains('Fake Stack Overflow');
    })

    function verifyQuestionsOnPage1() {
        const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 3'];
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
            cy.wrap($el).should('not.include.text', 'Question 2');
        })
    }

    it('successfully shows all questions on page 1', () => {
        verifyQuestionsOnPage1();
    });

    it('Does not show questions supposed to be on page 1', () => {
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('not.include.text', 'Question 2');
        })
    });

    it('Successfully shows all question stats on page 1', () => {
        const answers = ['2 answers', '7 answers', '0 answers', '0 answers', '0 answers'];
        const views = ['0 views', '121 views', '14 views', '141 views', '12 views'];
        const votes = ['10 votes', '0 votes', '2 votes', '5 votes', '0 votes'];
        cy.get('.postStats').each(($el, index, $list) => {
            cy.wrap($el).should('contain', answers[index]);
            cy.wrap($el).should('contain', views[index]);
            cy.wrap($el).should('contain', votes[index]);
        })
    })

    it('Successfully shows all question summary on page 1', () => {
        const summary = ['the alert shows the proper index for the li clicked, and when I alert the variab...', 'I am using bottom navigation view but am using custom navigation, so my fragment...', 'Question 5 text', 'Question 4 text', 'Question 3 text'];
        cy.get('.summary').each(($el, index, $list) => {
            cy.wrap($el).should('contain', summary[index]);
        })
    })

    it('Successfully shows all question tags on page 1', () => {
        const tags = [['react', 'javascript'], ['javascript', 'android-studio', 'shared-preferences'], ['javascript', 'shared-preferences'], ['javascript', 'shared-preferences'], ['android-studio']];
        cy.wait(1000);
        cy.get('.pillContainer').each(($el, index, $list) => {
            cy.wrap($el).find('.pill').each(($el2, index2, $list) => {
                cy.wrap($el2).should('contain', tags[index][index2]);
            })
        })
    })

    it('successfully shows all question authors and date time', () => {
        const authors = ['samZ', 'newGuy', 'newGuy', 'newGuy', 'samZ'];
        const date = ['Nov 20', 'Oct 06', 'Oct 05', 'Oct 04', 'Oct 03'];
        const times = ['03:24', '11:24', '11:24', '11:24', '11:24'];
        cy.get('.lastActivity').each(($el, index, $list) => {
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', date[index]);
            cy.wrap($el).should('contain', times[index]);
        })
    })

    it('Disable prev button when on page 1', () => {
        verifyQuestionsOnPage1();
    })

    function verifyQuestionsOnPage2() {
        const qTitles = ['Question 2', 'Question 1'];
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    }

    it('Successfully move to page 2 and verify Questions on page 2', () => {
        cy.contains('button', 'Next').click();
        verifyQuestionsOnPage2();
    })

    it('Verify Prev goes to previous page', () => {
        cy.contains('button', 'Next').click();
        verifyQuestionsOnPage2();
        cy.contains('button', 'Prev').click();
        verifyQuestionsOnPage1();
    })

    it('Verify Next on last page goes to first page', () => {
        cy.contains('button', 'Next').click();
        verifyQuestionsOnPage2();
        cy.contains('button', 'Next').click();
        verifyQuestionsOnPage1();
    })

    it('successfully shows questions in active order', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router', 'Question 5', 'Question 4', 'Question 3'];
        cy.contains('Active').click();
        cy.contains('7 questions');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('successfully shows unanswered questions', () => {
        const qTitles = ['Question 5', 'Question 4', 'Question 3', 'Question 2', 'Question 1'];
        cy.contains('Unanswered').click();
        cy.contains('5 questions');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('Search string in question text', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string'];
        cy.get('#searchBar').type('navigation{enter}');
        cy.contains('1 question');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('Search string matches tag and text', () => {
        const qTitles = ["Programmatically navigate using React router", 'android studio save string shared preference, start activity and load the saved string'];
        cy.get('#searchBar').type('navigation [React]{enter}');
        cy.contains('2 questions');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('Search string matches multiple tags', () => {
        const qTitles = ["Programmatically navigate using React router", 'android studio save string shared preference, start activity and load the saved string', 'Question 3', 'Question 1'];
        cy.get('#searchBar').type('[React][android-studio]{enter}');
        cy.contains('4 questions').should('be.visible');;
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('Search and sort by newest', () => {
        const qTitles = ["Programmatically navigate using React router", 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 2'];
        cy.get('#searchBar').type('[javascript]{enter}');
        cy.contains('6 questions');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
        cy.contains('button', 'Next').click();
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', 'Question 1');
        })
    })

    it('Search and sort using newest button', () => {
        const qTitles = ["Programmatically navigate using React router", 'android studio save string shared preference, start activity and load the saved string', 'Question 5', 'Question 4', 'Question 2'];
        cy.get('#searchBar').type('[javascript]{enter}');
        cy.contains('Unanswered').click();
        cy.contains('Newest').click();
        cy.contains('6 questions');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
        cy.contains('button', 'Next').click();
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', 'Question 1');
        })
    })

    it('Search and sort using active button', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router", 'Question 5', 'Question 4', 'Question 2'];
        cy.get('#searchBar').type('[javascript]{enter}');
        cy.contains('Active').click();
        cy.contains('6 questions');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
        cy.contains('button', 'Next').click();
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', 'Question 1');
        })
    })

    it('Search and sort using unanswered button', () => {
        const qTitles = ['Question 5', 'Question 4', 'Question 2', 'Question 1'];
        cy.get('#searchBar').type('[javascript]{enter}');
        cy.contains('Unanswered').click();
        cy.contains('4 questions');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })
})

describe('Answer Page', () => {

    beforeEach(() => {
        cy.contains('android studio save string shared preference, start activity and load the saved string').click();
    })

    it('Answer Page displays expected header', () => {
        cy.get('#answersHeader').should('contain', 'android studio save string shared preference, start activity and load the saved string');
        cy.get('#answersHeader').should('contain', '7 answers');
        cy.get('#answersHeader').should('not.contain', 'Ask a Question');
        cy.get('#sideBarNav').should('contain', 'Questions');
        cy.get('#sideBarNav').should('contain', 'Tags');
    })

    it('Answer Page should not show vote buttons to guest', () => {
        cy.get('.vote-component button').should('not.exist');
    });

    it('Answer Page should not show add comment field to guest', () => {
        cy.get('.comment-form').should('not.exist');
    });

    it('Answer Page should not show Add answer button to guest', () => {
        cy.get('#addAnswerBtn').should('not.exist');
    })

    it('Answer Page displays expected question text and metadata', () => {
        const text = "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.";
        cy.get('#questionBody').should('contain', text);
        cy.get('#questionBody').should('contain', 'newGuy');
        cy.get('#questionBody').should('contain', 'Oct 06, 2023');
        cy.get('#questionBody').should('contain', '11:24');
        cy.get('#questionBody').should('contain', '122 views');
        cy.get('#questionBody').should('contain', '0 votes');
    })

    it('Answer Page displays expected question tags', () => {
        const tags = ['javascript', 'android-studio', 'shared-preferences'];
        cy.get('#questionBody').find('.pillContainer').each(($el) => {
            cy.wrap($el).find('.pill').each(($el2, index2) => {
                cy.wrap($el2).should('contain', tags[index2]);
            })
        })
    })

    it('Answer Page displays expected comments on the question and its stats', () => {
        const text = ['Comment 1. Some more text'];
        const username = ['newGuy'];
        const votes = ['10 votes'];
        cy.get('#questionBody').find('.comment-list').each(($el) => {
            cy.wrap($el).find('.comment').each(($el2, index2) => {
                cy.wrap($el2).should('contain', text[index2]);
                cy.wrap($el2).should('contain', username[index2]);
                cy.wrap($el2).should('contain', votes[index2]);
            })
        })
    })

    function verifyAnswersOnPage1() {
        const answers = ['Answer 7', 'answer text', 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', 'I just found all the above examples just too confusing, so I wrote my own. '];
        cy.get('.answerText').each(($el, index) => {
            cy.wrap($el).should('contain', answers[index]);
        });
    }

    it('Answer Page displays expected answers ', () => {
        verifyAnswersOnPage1();
    });

    it('Answer Page displays expected metadata and stats and vote', () => {
        const authors = ['samZ', 'samZ', 'samZ', 'samZ', 'newGuy'];
        const date = ['Oct 09', 'Nov 24', 'Nov 18', 'Nov 12', 'Nov 01'];
        const times = ['15:24', '08:24', '09:24', '03:30', '15:24'];
        const votes = ['0 votes', '10 votes', '0 votes', '0 votes', '0 votes'];
        cy.get('.answerAuthor').each(($el, index) => {
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', date[index]);
            cy.wrap($el).should('contain', times[index]);

        });
        cy.get('.answer .vote-component').each(($el, index) => {
            cy.wrap($el).should('contain', votes[index]);
        })
    });

    function verifyAnswersOnPage2() {
        const answers = ['Answer 7', 'Answer 6', 'Answer 5'];
        cy.get('.answerText').each(($el, index) => {
            cy.wrap($el).should('be.visible').should('contain', answers[index]);
        });
    }

    it('Verify pagination of answers. \nVerify accepted answer is pinned to the top of every page. \nVerify thier metadata', () => {
        cy.get('.answer-list div.paginationControls').contains('button', 'Next').last().click();
        verifyAnswersOnPage2();
        const authors = ['samZ', 'newGuy2', 'newGuy'];
        const date = ['Oct 09', 'Oct 08', 'Oct 07'];
        const times = ['15:24', '15:24', '15:24'];
        const votes = ['0 votes', '0 votes', '0 votes'];
        cy.get('.answerAuthor').each(($el, index) => {
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', date[index]);
            cy.wrap($el).should('contain', times[index]);

        });
        cy.get('.answer .vote-component').each(($el, index) => {
            cy.wrap($el).should('contain', votes[index]);
        })
    });

    it('Verify next button on last page of answers rolls over to first page ', () => {
        verifyAnswersOnPage1();
        cy.get('.answer-list div.paginationControls').last().contains('button', 'Next').click();
        verifyAnswersOnPage2();
        cy.get('.answer-list div.paginationControls').last().contains('button', 'Next').click();
        verifyAnswersOnPage1();
    });

    it('Verify accepted answer is marked.', () => {
        const answerText = 'Answer 7';
        cy.get('.answerText').first().should('contain', answerText);
        cy.get('.answer').each(($el, index) => {
            if (index === 0) {
                cy.wrap($el).find('.svg-icon.iconCheckmarkLg').should('exist');
            }
            else {
                cy.wrap($el).find('.svg-icon.iconCheckmarkLg').should('not.exist');
            }
        });
    });

    it('Verify comments on answer.', () => {
        const text = ['Comment 2. Some more text', 'Comment 1', 'Comment 3'];
        const username = ['newGuy2', 'newGuy2', 'samZ'];
        const votes = ['10 votes', '10 votes', '0 votes'];
        cy.contains('.answer', 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.').within(() => {
            cy.get('.comment-list').should('exist');
            cy.get('.comment-list .comment').each(($comment, index) => {
                cy.wrap($comment).should('contain', text[index]);
                cy.wrap($comment).should('contain', username[index]);
                cy.wrap($comment).should('contain', votes[index]);
            });
        });
    });

    it('Verify pagination of comments', () => {
        const text = ['Comment 2', 'Comment 4'];
        const username = ['newGuy', 'newGuy2'];
        const votes = ['1 votes', '10 votes'];
        cy.contains('.answer', 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.').within(() => {
            cy.get('.comment-list').should('exist');
            cy.get('.comment-list .paginationControls').contains('button', 'Next').click();
            cy.get('.comment-list .comment').each(($comment, index) => {
                cy.wrap($comment).should('contain', text[index]);
                cy.wrap($comment).should('contain', username[index]);
                cy.wrap($comment).should('contain', votes[index]);
            });
        });
    });

})

describe('All Tags', () => {
    it('Total Tag Count', () => {
        cy.contains('Tags').click();
        cy.contains('All Tags');
        cy.contains('4 Tags');
    })


    it('Tag names and count', () => {
        const tagNames = ['react', 'javascript', 'android-studio', 'shared-preferences'];
        const tagCounts = ['1 question', '6 questions', '3 question', '4 question'];
        cy.contains('Tags').click();
        cy.get('.tagNode').each(($el, index, $list) => {
            cy.wrap($el).should('contain', tagNames[index]);
            cy.wrap($el).should('contain', tagCounts[index]);
        })
    })

    it('Click Tag Name shows relevant questions', () => {
        cy.contains('Tags').click();
        cy.contains('studio').click();
        cy.contains('android studio save string shared preference, start activity and load the saved string')
        cy.contains('Question 1')
        cy.contains('Question 3')
        cy.should('not.contain', 'Programmatically navigate using React router')
    })
})

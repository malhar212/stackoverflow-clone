// Template test file. Change the file to add more tests.
before(() => {
    // Seed the database before each test
    const { stdout, stderr } = cy.exec('node ../server/init.js', { log: true });
    console.log("Done insert");
});
after(() => {
    // Clear the database after each test
    cy.exec('node ../server/destroy.js', { log: true });
    console.log("Done destroy")
});

beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.contains('Guest').click();
})

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
        const answers = ['2 answers', '4 answers', '0 answers', '0 answers', '0 answers'];
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
        cy.contains('4 questions');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })
})
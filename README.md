[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/hxTav0v1)
Login with your Northeastern credentials and read the Project Specifications [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/EcUflH7GXMBEjXGjx-qRQMkB7cfHNaHk9LYqeHRm7tgrKg?e=oZEef3).

## Instructions to setup and run project
### Make sure your MongoDB instance is running.

### Navigate to the Project folder in terminal.

### Server Side (Node.js/Express):

1. **Navigate to the server folder:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Populate the server database:**
    ```bash
   node init.js
   ```
3. **Run the server:**
   ```bash
   node server.js
   ```

3. **Delete data from the server database:**
    ```bash
   node destroy.js
   ```

### Client Side (React):

1. **Navigate to the client folder:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the React app:**
   ```bash
   npm start
   ```
   
1. **Run the client using the following command to enable Code Coverage:**
    ```bash
   npm test
   ```

### Running Tests in Cypress:

1. **Navigate to the client folder:**
   ```bash
   cd testing
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the React app:**
   ```bash
   npx cypress run --config watchForFileChanges=false
   ```

1. **Find code coverage report in /testing/coverage/lcov-report/index.html**

## Team Member 1 Contribution
1. Profile Page, Add/Edit/Delete for Questions, Answers, Tags.
2. Tests for Add/Edit/Delete for Questions, Answers, Tags.
5. CSS stylings
4. Server implementation.
4. Implement Authentication and Login.

## Team Member 2 Contribution
1. Singleton object to interface with server APIs.
2. Builder pattern in server to build objects in appropriate format for database document or UI objects.
3. Factory pattern in server to create Builder objects without specifying their concrete classes.
4. Fix issues with Authentication and Login.
1. Questions, Search, Answers, Comments and Voting functionality.
1. Questions, Search, Answers, Comments and Voting Tests for Guest and LoggedIn user.
1. Tests for Login and Sign-up and Profile Page, Edit/Delete Tags & Answers
1. Code Coverage


## Design Patterns Used
1. 
    - Design Pattern Name: Singleton pattern

    - Problem Solved: Ensures a single instance of Axios across the application, managing configurations uniformly to prevent duplicate instances, conflicting settings like base URL, default headers, interceptors, etc, and redundant resource usage.

    - Location in code where pattern is used: client\src\models\ModelDAO.js
2. 
    - Design Pattern Name: Builder pattern

    - Problem Solved:
        - Provide flexible object creation to build mongoose objects to save them or to build objects from db results that map to the format that the UI expects.
        - Abstracts object construction from its final representation.
        - Enhances code readability and maintainability by encapsulating construction logic.

    - Location in code where pattern is used: server\controllers\builders, server\controllers\questionController.js formatQuestionsForUI
3. 
    - Design Pattern Name: Factory Pattern

    - Problem Solved: By delegating the creation process to the factory, it encapsulates the logic to determine which specific builder class to instantiate. This enables the system to create objects (builders in this case) without exposing the intricacies of their instantiation, enhancing flexibility and maintainability.

    - Location in code where pattern is used: server\controllers\builders\builderFactory.js formatQuestionsForUI line 12
    
## Test cases

| Use-case Name   | Test case Name |
|-----------------|----------------|
| Home Page | Successfully shows All Questions string                                                    |
| Home Page | Should not show Ask a Question button to Guest                                             |
| Home Page | successfully shows menu items                                                              |
| Home Page | Should not show options of a Logged In user                                                |
| Home Page | successfully shows total questions number                                                  |
| Home Page | successfully shows filter buttons                                                          |
| Home Page | successfully shows search bar                                                              |
| Home Page | successfully shows page title                                                              |
| Home Page | successfully shows all questions on page 1                                                 |
| Home Page | Does not show questions supposed to be on page 1                                           |
| Home Page | Successfully shows all question stats on page 1                                            |
| Home Page | Successfully shows all question summary on page 1                                          |
| Home Page | Successfully shows all question tags on page 1                                             |
| Home Page | successfully shows all question authors and date time                                      |
| Home Page | Disable prev button when on page 1                                                         |
| Home Page | Successfully move to page 2 and verify Questions on page 2                                 |
| Home Page | Verify Prev goes to previous page                                                          |
| Home Page | Verify Next on last page goes to first page                                                |
| Home Page | successfully shows questions in active order                                               |
| Home Page | successfully shows unanswered questions                                                    |
| Home Page | Search string in question text                                                             |
| Home Page | Search string matches tag and text                                                         |
| Home Page | Search string matches multiple tags                                                        |
| Home Page | Search and sort by newest                                                                  |
| Home Page | Search and sort using newest button                                                        |
| Home Page | Search and sort using active button                                                        |
| Home Page | Search and sort using unanswered button                                                    |
| Answer Page | Answer Page displays expected header                                                       |
| Answer Page | Answer Page should not show vote buttons to guest                                          |
| Answer Page | Answer Page should not show add comment field to guest                                     |
| Answer Page | Answer Page should not show Add answer button to guest                                     |
| Answer Page | Answer Page displays expected question text and metadata                                   |
| Answer Page | Answer Page displays expected question tags                                                |
| Answer Page | Answer Page displays expected comments on the question and its stats                       |
| Answer Page | Answer Page displays expected answers                                                      |
| Answer Page | Answer Page displays expected metadata and stats and vote                                  |
| Answer Page | Verify pagination of answers.                                                              |
| Answer Page | Verify next button on last page of answers rolls over to first page                        |
| Answer Page | Verify accepted answer is marked.                                                          |
| Answer Page | Verify comments on answer.                                                                 |
| Answer Page | Verify pagination of comments                                                              |
| All Tags | Total Tag Count                                                                            |
| All Tags | Tag names and count                                                                        |
| All Tags | Click Tag Name shows relevant questions                                                    |
| Add Question Page | Should show question form.                                                                 |
| Add Question Page | Should have question text form input                                                       |
| Add Question Page | Should have question text form input                                                       |
| Add Question Page | Should have question text form input                                                       |
| Add Question Page | Should contain Ask a Question Text                                                         |
| Add Question Page | Submits form with all empty fields                                                         |
| Add Question Page | displays an error for title with over 100 characters                                       |
| Add Question Page | displays an error for title with over 100 characters w/ correct QuestionText               |
| Add Question Page | creates only one instance of a tag if entered several times                                |
| Add Question Page | tag text converted to lower case                                                           |
| Add Question Page | Ask a Question creates and displays in All Questions                                       |
| Add Question Page | Ask a Question creates and displays expected meta data in Unanswered                       |
| Add Question Page | Ask a Question creates new question and shows up in Active order                           |
| Add Question Page | Ask a Question creates and displays in All Questions with necessary tags                   |
| Add Question Page | Ask a Question creates and displays in All Questions with necessary tags                   |
| Add Question Page | Ask a Question with empty title shows error                                                |
| Add Question Page | Ask a Question with long title shows error                                                 |
| Add Question Page | Ask a Question with empty text shows error                                                 |
| Add Question Page | Ask a Question with more than 5 tags shows error                                           |
| Add Question Page | Ask a Question with a long new tag                                                         |
| Home Page       | Should show Ask a Question button to LoggedIn user                                         |
| Home Page       | successfully shows menu options of a Logged In user                                        |
| User Profile    | Successfully shows info and options of a Logged In user on Profile Page                    |
| User Profile    | Successfully shows users answers correctly                                                 |
| User Profile    | Successfully shows users questions correctly                                               |
| User Profile    | Successfully shows users tags correctly                                                    |
| Answers Page    | Answer Page displays expected header                                                       |
| Answers Page    | Answer Page should show vote buttons to guest                                              |
| Answers Page    | Answer Page should show add comment field to guest                                         |
| Answers Page    | Answer Page should show Add answer button to guest                                         |
| Answers Page    | User with low reputation cannot Add a new comment                                          |
| Answers Page    | User cannot Add a empty comment                                                            |
| Answers Page    | User cannot Add a comment longer than 140 characters                                       |
| Answers Page    | Add a new comment to question                                                              |
| Answers Page    | Add a new comment to answer                                                                |
| Answers Page    | Comment should have only upvote button                                                     |
| Answers Page    | Adding comment to Question should make Question active                                     |
| Answers Page    | Adding comment to Answer should make Question active                                       |
| Answers Page    | User does not see accept answer button on other user's questions                           |
| Answers Page    | User does not see accept answer button on own question with already accepted answer        |
| Answers Page    | User sees accept answer button on own question                                             |
| Answers Page    | User accepts answer should mark pin the accepted answer to top                             |
| Answers Page    | User accepts answer should mark the question active                                        |
| Answers Page    | User with low reputation cannot vote on Question                                           |
| Answers Page    | User with low reputation cannot vote on Answer                                             |
| Answers Page    | User with low reputation cannot vote on Comment                                            |
| Answers Page    | Upvoting Question increments by 1                                                          |
| Answers Page    | Downvoting Question decrements by 1                                                        |
| Answers Page    | Upvoting an Answer increments by 1                                                         |
| Answers Page    | Downvoting an Answer decrements by 1                                                       |
| Answers Page    | Upvoting a Comment on a Question increments by 1                                           |
| Answers Page    | Upvoting a Comment on An answer increments by 1                                            |
| Answers Page    | Upvoting Question makes it active                                                          |
| Answers Page    | Downvoting Question makes it active                                                        |
| Answers Page    | Upvoting an Answer makes corresponding Question active                                     |
| Answers Page    | Downvoting an Answer makes corresponding Question makes it active                          |
| Answers Page    | Upvoting a Comment makes corresponding Question active                                     |
| Answers Page    | Upvoting a Comment on An answer makes corresponding Question active                        |
| Answers Page    | Upvoting Question increments corresponding user reputation by 5                            |
| Answers Page    | Downvoting Question decrements corresponding user reputation by 10                         |
| Answers Page    | Upvoting an Answer increments corresponding user reputation by 5                           |
| Answers Page    | Downvoting an Answer decrements corresponding user reputation by 10                        |
| Answers Page    | Upvoting a Comment has no impact on user reputation                                        |
| Answers Page    | Upvoting a Comment on An answer has no impact on user reputation                           |
| Editing/Deleting Tags | Make sure tags in use by other users are not editable                                      |
| Editing/Deleting Tags | Deleting tag deletes it from all questions                                                 |
| Editing/Deleting Tags | Editing tag updates it for all questions                                                   |
| Editing/Deleting Tags | Empty tag name is rejected                                                                 |
| Add Answer      | Create new answer should be displayed at the top of the answers page                       |
| Add Answer      | Answer is mandatory when creating a new answer                                             |
| Add Answer      | Adds an answer with a hyperlink and verifies                                               |
| Add Answer      | Attempts to add an answer with an invalid hyperlink and verifies failure                   |
| Add Answer      | Create new answer marks the question active                                                |
| Edit/Delete Answer | Deleting answer should remove answer from profile. Should not affect user reputation       |
| Edit/Delete Answer | Deleting answer should mark question active                                                |
| Edit/Delete Answer | Answer is mandatory when editing new answer                                                |
| Edit/Delete Answer | Edit an answer with a hyperlink and verifies                                               |
| Edit/Delete Answer | Attempts to update answer with an invalid hyperlink and verifies failure                   |
| Edit/Delete Answer | Editing an answer marks the question active                                                |
| Editing / Deleting Questions | Deleting question should delete from profile page                                          |
| Welcome Page    | Should contains Login, Signup and Guest buttons                                            |
| Welcome Page    | Should show Login form fields                                                              |
| Welcome Page    | Should show Signup form when Need Signup button click                                      |
| Welcome Page    | Should show Login form again after Already signed up button click                          |
| Login Page      | User doesn't input anything                                                                |
| Login Page      | User doesn't input username                                                                |
| Login Page      | User doesn't input password                                                                |
| Login Page      | Check successful login and redirection of a user                                           |
| Login Page      | User puts invalid password                                                                 |
| Login Page      | User doesn't exist                                                                         |
| Create Account  | User doesn't input anything                                                                |
| Create Account  | User inputs invalid email                                                                  |
| Create Account  | User passwords do not match                                                                |
| Create Account  | User passwords should not contain username                                                 |
| Create Account  | User passwords should not contain email                                                    |
| Create Account  | Username already taken                                                                     |
| Create Account  | Email already registered                                                                   |
| Create Account  | Successful Registration and redirection to login page and try login with new user          |
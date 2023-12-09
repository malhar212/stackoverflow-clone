[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/hxTav0v1)
Login with your Northeastern credentials and read the Project Specifications [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/EcUflH7GXMBEjXGjx-qRQMkB7cfHNaHk9LYqeHRm7tgrKg?e=oZEef3).

Add design docs in *images/*

## To-Do
1. Welcome page options to register or login or continue as guest user
1. Create Account
    - ~~Create Account Form Fields: username, email, and a secret password, repeat password~~
    - ~~email and username unique~~
    - ~~valid email~~
    - ~~password shouldn't contain username or email~~
2. Login
    - ~~Enter username, password~~
    - ~~Redirect to homepage~~
1. Logout
    - ~~If logout issues stay on same page, else redirect to welcome page~~
1. HomePage: 
    - ~~Show question summary~~
    - ~~number of votes on the querstion~~
    - ~~number of answers on the querstion~~
    - ~~Display 5 questions at a time.~~
    - ~~Next and Prev buttons~~
    - ~~Next should cycle over on last page~~
    - ~~but prev is disabled on first page~~
1. Search:
    - ~~Search results can be ordered according to sort buttons~~
1. New Question:
    - ~~New tags can only be added by users with reputation of 50 or more. ~~NOTE: get clarificaiton if shoudl addnew question w/o the new tags
1. Answers: 
    - ~~Show set of tags of the question~~
    - ~~No. of votes of the question~~
    - ~~Set of comments of the question below question text and tag set~~
    - ~~Scrollable answers~~
    - ~~Most recent first~~
    - ~~Show no. of votes of each answer~~
    - ~~Show comments of each answer~~
    - ~~pagination like questions 5 at  a time~~
    - ~~Only logged in Users see new answer button~~
    - Question, Answer have button to upvote or downvote
    - Upvoting increases the vote by 1 and downvoting decreases the vote by 1.
    - Upvoting a question/answer increases the reputation of the corresponding user by 5. 
    - Downvoting a question/answer decreases the reputation of the corresponding user by 10. 
    - A user can vote if their reputation is 50 or higher.
    - User who posted the question can mark one of the answers as accepted
    - ~~Accepted answer should appear at top, all others appear in newest order~~
1. New Answer:
    - Redirect to answers page
    - update question's lastActivity date
1. Comments:
    - ~~Most recent comment displayed on top~~
    - ~~Comments displayed 3 at a time~~
    - ~~Show text, username, vote.~~
    - ~~Pagination with next and prev buttons. Same behaviour like questions~~
    - For registerd user, new comment input field below the pagination
    - New comment is added on pressing enter
    - Comments limited to 140 characters
    - Can only be added by users with reputation 50 or more.
    - Comments only have upvotes. Increments by 1.
    - Upvoting comment has no impact on reputation.
    - Upvoting a comment makes corresponsing question active
1. Voting:
    - user can vote any number of times @180 piazza
    - voting on question/answer/comment updates question's lastActivity date
1. User Profile Page:
    - ~~User Information: No. days since user joined, reputation points~~
    - Menu: 
        - Link to view all questions of user
        - Link to view all tags of user
        - Link to view all answers of user
    - Sub views, show/hide based on link clicked:
        - Questions posted by the user:
            - Display question titles
            - Display 5 at a time, prev and next button like homepage
            - Clicking on question title takes to edit form pre-filled, user can repost or delete.
            - original date does not change in reposting
            - reposting updated lastActivity date
            - Deleting question deletes answers and comments and tag if not used in other questions
        - Tags created by the user:
            - Display in same manner as tags page
            - User has options to edit or delete tag
            - Editing/Deleting tag is allowed only if it is not in use by other users. It is allowed if it's used by only this user.
        - Answers posted by the user:
            - All answers displayed as links of 50 characters
            - Newest order
            - Clicking link shows answer form pre-filled, user can repost or delete
            - Deleting answer deletes it's votes and comments
            - Deleting answer has no effect on reputation
            - Repost/Delete of answer makes question active. i.e. update lastActivity date

Bugs:
    - When new question is created with no tags, all tags are added to it

## Instructions to setup and run project

Detailed instructions with all relevant commands go here.

## Team Member 1 Contribution


## Team Member 2 Contribution


## Test cases

| Use-case Name   | Test case Name |
|-----------------|----------------|
| Home Page       | Test-1         |
|                 | Test-2         |
| Login           | Test-1         |
|                 | Test-2         |

## Design Patterns Used

- Design Pattern Name:

- Problem Solved:

- Location in code where pattern is used:
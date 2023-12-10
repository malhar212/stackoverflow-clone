// Setup database with initial test data.
// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/users');
let Comment = require('./models/comments')

let mongoose = require('mongoose');
let mongoDB = "mongodb://localhost:27017/fake_so";
let db = mongoose.connection;
// let tags = [];
// let answers = [];
// let users = [];

function tagCreate(name, createdBy) {
    let tag = new Tag({ name: name, createdBy: createdBy });
    return tag.save();
}

function answerCreate(text, qid, ans_by, ans_date_time, votes, accepted) {
    let answerdetail = { text: text, qid: qid, ans_by: ans_by };
    if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
    if (votes != false) answerdetail.votes = votes;
    if (accepted != false) answerdetail.accepted = accepted;

    let answer = new Answer(answerdetail);
    return answer.save();
}

function questionCreate(title, text, tags, asked_by, ask_date_time, last_activity, views, votes) {
    let qstndetail = {
        title: title,
        text: text,
        tags: tags,
        asked_by: asked_by
    };
    if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
    if (last_activity != false) qstndetail.last_activity = last_activity;
    if (views != false) qstndetail.views = views;
    if (votes != false) qstndetail.votes = votes;

    let qstn = new Question(qstndetail);
    return qstn.save();
}


function userCreate(username, email, password, reputation) {
    let newUser = {
        username: username,
        email: email,
        password: password,
        reputation: reputation
    };
    if (reputation != undefined && reputation != false) newUser.reputation = reputation;
    let user = new User(newUser)
    return user.save();
}

function commentCreate(text, postedBy, associatedObjectType, associatedObjectId, votes, posted_date) {
    let newComment = {
        text,
        postedBy,
        associatedObjectType,
        associatedObjectId,
        votes
    };
    if (posted_date != undefined && posted_date != false) newComment.postedDate = posted_date;
    if (votes != undefined && votes != false) newComment.votes = votes;
    let user = new Comment(newComment)
    return user.save();
}

const populate = async () => {
    await mongoose.connect(mongoDB, { family: 4 });
    // mongoose.Promise = global.Promise;
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    
    // Create Users
    let userOne = await userCreate("samZ", "samZ@gmail.com", 'examplePass');
    let userTwo = await userCreate("newGuy", "newGuy@gmail.com", 'passExample', 60);
    let userThree = await userCreate("newGuy2", "copiedUsername@gmail.com", 'askdjalskdj', 55);

    // Create tags
    let t1 = await tagCreate('react', userOne);
    let t2 = await tagCreate('javascript', userOne);
    let t3 = await tagCreate('android-studio', userTwo);
    let t4 = await tagCreate('shared-preferences', userTwo);

    // Create Questions
    //[a1, a2]
    let q1 = await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], userOne, new Date('2023-11-20T03:24:00'), new Date('2023-11-25T08:24:00'), false, 10);
    // [a3, a4, a5, a0]
    let q2 = await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], userTwo, new Date('2023-10-06T11:24:30'), new Date('2023-11-26T03:24:00'), 121);
    
    // Added for pagination testing. TODO: need to update text
    await questionCreate('Question 1', 'Question 1 text', [t3, t4, t2], userTwo, new Date('2023-10-01T11:24:30'), new Date('2023-10-01T11:24:30'), 11);
    await questionCreate('Question 2', 'Question 2 text', [t2], userTwo, new Date('2023-10-02T11:24:30'), new Date('2023-10-02T11:24:30'), 1);
    await questionCreate('Question 3', 'Question 3 text', [t3], userOne, new Date('2023-10-03T11:24:30'), new Date('2023-10-03T11:24:30'), 12);
    await questionCreate('Question 4', 'Question 4 text', [t4, t2], userTwo, new Date('2023-10-04T11:24:30'), new Date('2023-10-04T11:24:30'), 141,5);
    await questionCreate('Question 5', 'Question 5 text', [t4, t2], userTwo, new Date('2023-10-05T11:24:30'), new Date('2023-10-05T11:24:30'), 14, 2);

    await answerCreate('answer text', q2, userOne, new Date('2023-11-24T08:24:00'), 10);
    await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', q1,  userOne, new Date('2023-11-20T03:24:42'), 30);
    await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', q1, userTwo, new Date('2023-11-25T08:24:00'), 20);
    let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', q2, userOne, new Date('2023-11-18T09:24:00'));
    await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', q2, userOne, new Date('2023-11-12T03:30:00'));
    await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', q2, userTwo, new Date('2023-11-01T15:24:19'));
    await answerCreate('Answer 5', q2, userTwo, new Date('2023-10-07T15:24:19'));
    await answerCreate('Answer 6', q2, userThree, new Date('2023-10-08T15:24:19'));
    await answerCreate('Answer 7', q2, userOne, new Date('2023-10-09T15:24:19'), 0, true);
    
    await commentCreate('Comment 1. Some more text', userTwo, 'question', q2, 10, new Date('2023-11-25T08:24:00'));
    await commentCreate('Comment 2. Some more text', userThree, 'answer', a3, 10, new Date('2023-11-26T03:24:00'));
    await commentCreate('Comment 1', userThree, 'answer', a3, 10, new Date('2023-11-22T12:24:00'));
    await commentCreate('Comment 2', userTwo, 'answer', a3, 1, new Date('2023-11-21T11:24:00'));
    await commentCreate('Comment 3', userOne, 'answer', a3, 0, new Date('2023-11-21T12:24:00'));
    await commentCreate('Comment 4', userThree, 'answer', a3, 10, new Date('2023-11-20T12:24:00'));
    if (db) db.close();
    console.log('done');
}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });

console.log('processing ...');

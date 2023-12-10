// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/users');


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// let tags = [];
// let answers = [];
// let users = [];

function tagCreate(name, createdBy) {
  let tag = new Tag({ name: name, createdBy: createdBy });
  return tag.save();
}

function answerCreate(text, qid, ans_by, ans_date_time, votes) {
  answerdetail = {text:text, qid:qid, ans_by:ans_by};
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  if (votes != false) answerdetail.votes = votes;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views) {
  qstndetail = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;

  let qstn = new Question(qstndetail);
  return qstn.save();
}


function userCreate(username, email, password, reputation) {
  let newUser = new User({
    username: username,
    email: email,
    password: password,
    reputation: reputation,
  })
  return newUser.save();
}

const populate = async () => {
  let userOne = await userCreate("samZ", "samZ@gmail.com", 'examplePass', 0);
  let userTwo = await userCreate("newGuy", "newGuy@gmail.com", 'passwordExample', 24);
  let userThree = await userCreate("highREP", "highRep@yahoo.com", "pass", 51);

  // let userThree = await userCreate("newGuy", "copiedUsername@gmail.com", 'askdjalskdj');


  let t1 = await tagCreate('react', userOne); 
  let t2 = await tagCreate('javascript', userOne);
  let t3 = await tagCreate('android-studio', userTwo);
  let t4 = await tagCreate('shared-preferences', userThree);

  await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [], userOne, new Date('2022-01-20T03:24:00'), false);
  await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [], userTwo, new Date('2023-10-01T11:24:30'), 121);
  
  // order for answer params (text, qid, ans_by, ans_date_time, votes) 
  // await answerCreate('answer text', '6570eab3f116c7ea3f3548cc', userOne, new Date('2023-11-25T08:24:00'));

  // let a0 = await answerCreate('answer text', userOne, new Date('2023-11-25T08:24:00'));
  // let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', userOne, new Date('2023-11-20T03:24:42'));
  // let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', userTwo, new Date('2023-11-25T08:24:00'));
  // let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', userOne, new Date('2023-11-18T09:24:00'));
  // let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', userOne, new Date('2023-11-12T03:30:00'));
  // let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', userTwo, new Date('2023-11-01T15:24:19'));

  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');

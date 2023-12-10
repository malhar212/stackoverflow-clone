const { ObjectId } = require('mongodb');
const Answer = require('../models/answers');
const Question = require('../models/questions');
const User = require("../models/users");
const Comment = require("../models/comments");
const BuilderFactory = require('./builders/builderFactory');
const { validateLinks } = require('./hyperlinkParser');

// Function to convert database results to the desired format for UI
function formatAnswersForUI(results) {
  const formattedAnswers = results.map(result => {
    const builder = new BuilderFactory().createBuilder({ builderType: 'answerUI' });

    const { _id, text, ans_by, ans_date_time, votes, accepted } = result;

    // Setting the fields using the builder pattern
    return builder
      .setAid(_id)
      .setText(text)
      .setAnsBy(ans_by)
      .setAnsDate(ans_date_time)
      .setVotes(votes)
      .setAccepted(accepted)
      .build();
  });
  return formattedAnswers;
}

exports.getAllAnswers = async (req, res) => {
  try {
    const answers = await Answer.find();
    const formattedAnswers = formatAnswersForUI(answers);
    res.status(200).json({ success: true, data: formattedAnswers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


//localhost:8000/answers/filterByIds?ids=656cf2553306392f5c8119f9
exports.filterAnswersBasedOnAnsIds = async (req, res) => {
  try {
    console.log("IN filter answers by ans ids")
    const { ids } = req.query;
    if (ids === undefined || ids.length <= 0) {
      res.status(404).json({ success: false, error: "Provide a valid list of ids in query" });
      return;
    }
    const idList = ids.split(',');
    if (idList.length <= 0) {
      res.status(404).json({ success: false, error: "Provide a valid list of ids in query" });
      return;
    }
    const answers = await Answer.find({ _id: { $in: idList } }).sort({ ans_date_time: 1 });
    const formattedAnswers = formatAnswersForUI(answers);
    res.status(200).json({ success: true, data: formattedAnswers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.filterAnswersBasedOnQuestionId = async (req, res) => {
  try {
    const id = req.params.id;
    if (id === undefined || id.length <= 0) {
      res.status(404).json({ success: false, error: "No QID provided" });
      return;
    }
    const answers = await Answer.aggregate(
      [
        {
          $match: {
            qid: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "ans_by",
            foreignField: "_id",
            as: "ans_by",
          },
        },
        {
          $addFields: {
            ans_by: {
              $arrayElemAt: ["$ans_by.username", 0],
            },
          },
        },
        {
          $sort: {
            accepted: -1,
            ans_date_time: -1,
          },
        },
      ]
    );
    console.log(answers);
    const formattedAnswers = formatAnswersForUI(answers);
    res.status(200).json({ success: true, data: formattedAnswers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.fetchUserAnswers = async (req, res) => {
  console.log("+++++IN FETCH USER ANSWERSSSSSSS+++++++")
  try {
    console.log("++====++==++==++==", req.session.user)
    const username = req.session.user.username
    console.log("++++++++ USERNAMEM: " + username)
    if (username === undefined) {
      res.status(404).json({ success: false, error: "Username is undefined" });
      return;
    }
    // const idList = ids.split(',');
    // if (idList.length <= 0) {
    //   res.status(404).json({ success: false, error: "Provide a valid list of ids in query" });
    //   return;
    // }
    console.log("11111111++====++==++==++==")
    try {
      // get the user object based on username
      const user = await User.findOne({ username });
      const answers = await Answer.find({ 'ans_by': user._id }).sort({ ans_date_time: 1 });
      console.log(answers); // Check the retrieved answers in the console
      console.log("222222222++====++==++==++==")
      console.log(answers)
      res.status(200).json({ success: true, data: answers });
    } catch (error) {
      console.error('Error fetching answers:', error);
      return;
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addAnswer = async (req, res) => {
  console.log("++++++++ADD ANSWER 1" + (JSON.stringify(req.body, null, 4)))
  try {
    if (req.body === undefined || req.body.answer === undefined) {
      console.log("++++++++ADD ANSWER 2" + req.body.answer)
      res.status(500).json({ success: false, error: "Answer body not provided" });
      return;
    }
    if (req.body.qid === undefined || req.body.qid.trim().length === 0) {
      console.log("++++++++ADD ANSWER 3" + req.body.qid)
      res.status(500).json({ success: false, error: "Associated Question ID not provided" });
      return;
    }
    console.log("++++++++ BEFORE GETTING QUESTION ")

    try {
      const question = await Question.findById(req.body.qid);
      console.log("++++++++ AFTER GETTING QUESTION " + (JSON.stringify(question, null, 4)))
      if (!question) {
        res.status(404).json({ success: false, error: "No question found for the provided Question ID" });
        return;
      }
    } catch (error) {
      res.status(500).json({ success: false, error: "Error while retrieving the question" });
      return;
    }


    console.log("+++++ADD ANSWER 4")
    console.log("++++++ JSON: " + JSON.stringify(req.body.answer, null, 4))

    const formData = req.body.answer;
    const { isValid, error } = validateAnswer(formData);
    console.log("++++ AFTER VALIDATION ")
    if (!isValid) {
      res.status(500).json({ success: false, error });
      return;
    }

    // extracting username from formData
    const username = formData.ans_by
    // finding the user object from database based on username
    const user = await User.findOne({ username });
    console.log("++++++++ADD ANSWER 5" + (JSON.stringify(user, null, 4)))
    const answerBuilder = new BuilderFactory().createBuilder({ builderType: 'answer' });
    console.log("+++++++++ADD ANSWER 6 ")
    const answer = answerBuilder.setText(formData.text).setAnsBy(user).setQid(await Question.findById(req.body.qid)).setAnsDate(new Date()).build();
    console.log("+++++++++ADD ANSWER 7: " + (JSON.stringify(answer, null, 4)))
    try {
      var savedAnswer = await answer.save();
    } catch (err) {
      console.log(err)
      return;
    }
    console.log("+++++++++ADD ANSWER 8 ") 
    
    // updates the answer's Question so the last_activity shows the answer being created
    await Question.findByIdAndUpdate(answer.qid, { $set: { last_activity: Date.now() } }, { new: true });
    console.log("+++++++++ADD ANSWER 9 ");
    res.status(200).json({ success: true, data: savedAnswer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const validateAnswer = (formData) => {
  let isValid = true;
  let error = '';

  // Validate text
  if (formData.text.trim() === '') {
    isValid = false;
    error = 'Answer text cannot be empty';
    return { isValid, error };
  }

  if (!validateLinks(formData.text.trim())) {
    isValid = false;
    error = 'Invalid hyperlink';
    return { isValid, error };
  }
  return { isValid, error };
};


exports.updateAnswerById = async (req, res) => {
  const { ansId } = req.params;
  const { text } = req.body;

  try {
    const updatedAnswer = await Answer.findByIdAndUpdate(ansId, { $set: { text: text } }, { new: true });
    if (!updatedAnswer) {
      return res.status(404).json({ success: false, message: 'Answer not found.' });
    }
    // The updated answer also updates the "last_activity" of the question it's associated with 
    await Question.findByIdAndUpdate(updatedAnswer.qid, { $set: { last_activity: Date.now() }}, { new: true });
    res.status(200).json({ success: true, data: updatedAnswer });
  } catch (error) {
    console.error('Error updating answer:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// delete answer should delete its votes and comments
// the answer is the "associatedObject" of the comment
exports.deleteAnswerById = async (req, res) => {
  console.log("++++++ in deleteAnswerByID 1")
  const { ansId } = req.params;
  try {
    console.log("++++++ in deleteAnswerByID 2" + ansId)
    const answerObj = await Answer.findById(ansId);
    const qid = answerObj.qid;
    console.log("++++++ in deleteAnswerByID 3" + JSON.stringify(answerObj, null, 5))
    // deleting associated comments
    const status_of_comment_deletion = await Comment.deleteMany({ associatedObjectId: ansId });
    console.log(status_of_comment_deletion);
    console.log("+++++ Comments deleted?")
    
    const deletedAnswer = await Answer.findByIdAndDelete(ansId);
    console.log("+++++++ Answer deleted")

    if (!deletedAnswer) {
      return res.status(404).json({ success: false, message: 'Answer not found.' });
    }
    await Question.findByIdAndUpdate(qid, { $set: { last_activity : Date.now}}, { new: true });
    console.log("About to send success!")
    res.status(200).json({ success: true, data: deletedAnswer });
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

exports.acceptAnswer = async (req, res) => {
  if (req.params === undefined && req.params.ansId === undefined || req.params.ansId.trim().length === 0) {
    res.status(500).json({ success: false, error: "Answer ID not provided" });
  }
  const { ansId } = req.params;
  try {
    const answer = await Answer.findById(ansId);
    if (!answer) {
      return res.status(404).json({ success: false, message: 'Answer not found.' });
    }
    // Find other answers with the same qid and accepted: true
    const otherAcceptedAnswers = await Answer.find({
      qid: answer.qid,
      accepted: true
    });
    if (otherAcceptedAnswers.length > 0) {
      console.log('There are other accepted answers for this question.');
      return res.status(403).json({ success: false, message: 'There are other accepted answers for this question.' });
    }
    console.log("Locals:", req.locals);
    console.log("Answer :", answer.ans_by.toString());
    console.log("Session :", req.session.user.uid);
    const question = await Question.findById(answer.qid);
    if (question.asked_by.toString() !== req.session.user.uid) {
      return res.status(403).json({ success: false, message: 'Not authorized to accept answer' });
    }
    answer.accepted = true;
    question.last_activity = Date.now();
    await question.save();
    await answer.save();
    res.status(200).json({ success: true, data: formatAnswersForUI([answer]) });
  } catch (error) {
    console.error('Error updating answer:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
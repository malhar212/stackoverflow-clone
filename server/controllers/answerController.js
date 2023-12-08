const { ObjectId } = require('mongodb');
const Answer = require('../models/answers');
const Question = require('../models/questions');
const User = require("../models/users");
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

exports.addAnswer = async (req, res) => {
  console.log("++++++++ADDANSWER 1" + req.body)
  try {
    if (req.body === undefined || req.body.answer === undefined) {
      console.log("++++++++ADDANSWER 2" + req.body.answer)
      res.status(500).json({ success: false, error: "Answer body not provided" });
      return;
    }
    if (req.body.qid === undefined || req.body.qid.trim().length === 0) {
      console.log("++++++++ADDANSWER 3" + req.body.qid)
      res.status(500).json({ success: false, error: "Associated Question ID not provided" });
      return;
    }
    console.log("++++++++ BEFORE GETTING QUESTION ")
    const question = await Question.findById(req.body.qid);
    console.log("++++++++ AFTER GETTING QUESTION " + (JSON.stringify(question, null, 4)))
    if (question === null) {
      console.log("+++++QUESTION IS NULL!")
      res.status(500).json({ success: false, error: "No question for provided Question ID" });
      return;
    }
    console.log("+++++FORMDATA ")
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
    console.log("++++++++ADDANSWER 4" + username)
    // finding the user object from database based on username
    const user = await User.findOne({ username });
    console.log("++++++++ADDANSWER 5" + (JSON.stringify(user, null, 4)))

    console.log(JSON.stringify(formData, null, 4))
    const answerBuilder = new BuilderFactory().createBuilder({ builderType: 'answer' });
    console.log("+++++++++ADDANSWER 6 ")
    const answer = answerBuilder.setText(formData.text).setAnsBy(user).setQid(question).setAnsDate(new Date()).build();
    console.log("+++++++++ADDANSWER 7 ") 
    try {
      var savedAnswer = await answer.save();
    } catch (err) {
      console.log(err)
      return;
    }
      console.log("+++++++++ADDANSWER 8 ") 
    question.answers.push(savedAnswer);
    console.log("+++++++++ADDANSWER 9 ") 
    await question.save();
    console.log("+++++++++ADDANSWER 10 ") 
    res.status(200).json({ success: true, data: savedAnswer });
  } catch (err) {
    "+++++FAILED FAILED FAILED ++++++++"
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
const { ObjectId } = require('mongodb');
const Answer = require('../models/answers');
const Question = require('../models/questions');
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
  try {
    if (req.body === undefined || req.body.answer === undefined) {
      res.status(500).json({ success: false, error: "Answer body not provided" });
      return;
    }
    if (req.body.qid === undefined || req.body.qid.trim().length === 0) {
      res.status(500).json({ success: false, error: "Associated Question ID not provided" });
      return;
    }
    const question = await Question.findById(req.body.qid);
    if (question === null) {
      res.status(500).json({ success: false, error: "No question for provided Question ID" });
      return;
    }
    const formData = req.body.answer;
    const { isValid, error } = validateAnswer(formData);
    if (!isValid) {
      res.status(500).json({ success: false, error });
      return;
    }
    const answerBuilder = new BuilderFactory().createBuilder({ builderType: 'answer' });
    const answer = answerBuilder.setText(formData.text).setAnsBy(formData.ansBy).setAnsDate(new Date()).build();
    const savedAnswer = await answer.save();
    question.answers.push(savedAnswer);
    await question.save();
    res.status(200).json({ success: true, data: savedAnswer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const validateAnswer = (formData) => {
  let isValid = true;
  let error = '';
  // Validate username
  if (formData.ansBy === undefined || formData.ansBy.trim() == '') {
    isValid = false;
    error = 'Username cannot be empty';
    return { isValid, error };
  }

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
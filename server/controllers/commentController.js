const { ObjectId } = require("mongodb");
const Comment = require("../models/comments");
const BuilderFactory = require("./builders/builderFactory");

// Function to convert database results to the desired format for UI
function formatCommentForUI(results) {
    const formattedTags = results.map(result => {
        let builder = new BuilderFactory().createBuilder({ builderType: 'commentUI' });

        const { _id, text, postedBy, associatedObjectType, associatedObjectId, votes, postedDate  } = result;

        // Setting the fields using the builder pattern
        return builder
            .setCid(_id)
            .setText(text)
            .setPostedBy(postedBy)
            .setAssociatedObjectType(associatedObjectType)
            .setAssociatedObjectId(associatedObjectId)
            .setVotes(votes)
            .setPostedDate(postedDate)
            .build();
    });
    return formattedTags;
}

exports.getCommentsByAssociatedId = async (req, res) => {
    try {
        const id = req.params.id;
        if (id === undefined || id.length <= 0) {
            res.status(404).json({ success: false, error: "No associated Object ID provided" });
            return;
        }
        const comments = await Comment.aggregate([
          {
            $match: {
              associatedObjectId: new ObjectId(id)
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "postedBy",
              foreignField: "_id",
              as: "postedBy",
            },
          },
          {
            $addFields: {
              postedBy: {
                $arrayElemAt: ["$postedBy.username", 0],
              },
            },
          },
          {
            $sort: {
              postedDate: -1,
            },
          },
        ]);
        const formattedComments = formatCommentForUI(comments);
        res.status(200).json({ success: true, data: formattedComments });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.addComment = async (req, res) => {
    try {
      if (req.body === undefined || req.body.answer === undefined) {
        res.status(500).json({ success: false, error: "Answer body not provided" });
        return;
      }
      if (req.body.qid === undefined || req.body.qid.trim().length === 0) {
        res.status(500).json({ success: false, error: "Associated Question ID not provided" });
        return;
      }
      const question = /* await Question.findById */(req.body.qid);
      if (question === null) {
        res.status(500).json({ success: false, error: "No question for provided Question ID" });
        return;
      }
      const formData = req.body.answer;
      const { isValid, error } = /* validateAnswer */(formData);
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
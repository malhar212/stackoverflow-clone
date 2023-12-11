const { ObjectId } = require("mongodb");
const Comment = require("../models/comments");
const BuilderFactory = require("./builders/builderFactory");
const { OBJECT_TYPES } = require('../config/enums');
const Question = require("../models/questions");
const Answer = require("../models/answers");

// Function to convert database results to the desired format for UI
function formatCommentForUI(results) {
  const formattedTags = results.map(result => {
    let builder = new BuilderFactory().createBuilder({ builderType: 'commentUI' });

    const { _id, text, postedBy, associatedObjectType, associatedObjectId, votes, postedDate } = result;

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
    if (req.body === undefined || req.body.comment === undefined) {
      res.status(500).json({ success: false, error: "Comment body not provided" });
      return;
    }
    if (req.user.reputation < 50) {
      res.status(500).json({ success: false, error: "User does not have enough reputation" });
      return;
    }
    const comment = req.body.comment;
    // console.log(comment);
    let associatedObject = undefined;
    if (comment.associatedObjectType === OBJECT_TYPES.QUESTION) {
      associatedObject = await Question.findById(comment.associatedObjectId);
    }
    else if (comment.associatedObjectType === OBJECT_TYPES.ANSWER) {
      associatedObject = await Answer.findById(comment.associatedObjectId);
    }
    else {
      console.error("Valid associated object type not provided");
      res.status(500).json({ success: false, error: "Valid associated object type not provided" });
      return;
    }
    if (associatedObject === undefined) {
      console.error("Valid associated object not found");
      res.status(500).json({ success: false, error: "Valid associated object not found" });
      return;
    }
    // console.log(associatedObject);
    if (comment.text === undefined || comment.text.trim().length === 0 || comment.text.trim().length > 140) {
      console.error("Comment text is required and has to be less than 140 characters");
      res.status(500).json({ success: false, error: "Comment text is required and has to be less than 140 characters" });
      return;
    }
    const commentBuilder = new BuilderFactory().createBuilder({ builderType: 'comment' });
    const newComment = commentBuilder.setText(comment.text).setPostedBy(req.session.user.uid).setAssociatedObjectType(comment.associatedObjectType).setAssociatedObjectId(associatedObject).build();
    const savedComment = await newComment.save();

    // Update last activity of associated question
    if (comment.associatedObjectType === OBJECT_TYPES.QUESTION) {
      associatedObject.last_activity = savedComment.postedDate;
      await associatedObject.save();
    }
    else if (comment.associatedObjectType === OBJECT_TYPES.ANSWER) {
      const associatedQuestion = await Question.findById(associatedObject.qid);
      associatedQuestion.last_activity = savedComment.postedDate;
      await associatedQuestion.save();
    }
    const formattedComments = formatCommentForUI([savedComment]);
    formattedComments[0].postedBy = req.session.user.username;
    // console.log(formattedComments);
    res.status(200).json({ success: true, data: formattedComments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
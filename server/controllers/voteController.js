const { OBJECT_TYPES, VOTES } = require("../config/enums");
const Answer = require("../models/answers");
const Comment = require("../models/comments");
const Question = require("../models/questions");
const User = require("../models/users");

// uses uid to get the username
exports.vote = async (req, res) => {
    try {
        if (req.user.reputation < 50) {
            return res.status(403).json({ success: false, error: "Not enough reputation" });
        }
        if (req.body === undefined || req.body.vote === undefined) {
            res.status(500).json({ success: false, error: "Vote body not provided" });
            return;
        }
        const vote = req.body.vote;
        if (vote.parent === undefined || vote.type === undefined || (vote.type !== VOTES.UPVOTE && vote.type !== VOTES.DOWNVOTE) || vote.parentId === undefined) {
            return res.status(500).json({ success: false, error: "Vote information not provided" });
        }
        if (vote.type === VOTES.DOWNVOTE && vote.parent === OBJECT_TYPES.COMMENT) {
            return res.status(500).json({ success: false, error: "Comments cannot be downvoted" });
        }
        const increment = vote.type === VOTES.UPVOTE ? 1 : -1;
        const reputationIncrement = vote.type === VOTES.UPVOTE ? 5 : -10;
        switch (vote.parent) {
            case OBJECT_TYPES.QUESTION: {
                const question = await Question.findByIdAndUpdate(vote.parentId, {
                    $inc: { votes: increment },
                    $set: { last_activity: Date.now() }
                }, { new: true });
                if (question) {
                    await User.findByIdAndUpdate(question.asked_by, {
                        $inc: { reputation: reputationIncrement },
                    }, { new: true });
                    return res.status(200).json({ success: true, data: { msg: 'Vote updated successfully' } });
                } else {
                    console.error('Question not found or not updated.');
                    return res.status(500).json({ success: false, error: "Question not found or not updated." });
                }
            }
            case OBJECT_TYPES.ANSWER: {
                const answer = await Answer.findByIdAndUpdate(vote.parentId, {
                    $inc: { votes: increment }
                }, { new: true });
                const question = await Question.findByIdAndUpdate(answer.qid, {
                    $set: { last_activity: Date.now() } 
                }, { new: true });
                if (answer && question) {
                    await User.findByIdAndUpdate(answer.ans_by, {
                        $inc: { reputation: reputationIncrement },
                    }, { new: true });
                    return res.status(200).json({ success: true, data: { msg: 'Vote updated successfully' } });
                } else {
                    console.error('Answer not found or not updated.');
                    return res.status(500).json({ success: false, error: "Answer not found or not updated." });
                }
            }
            case OBJECT_TYPES.COMMENT: {
                const comment = await Comment.findByIdAndUpdate(vote.parentId, {
                    $inc: { votes: increment }
                }, { new: true });
                if (comment) {
                    // Update last activity of associated question
                    if (comment.associatedObjectType === OBJECT_TYPES.QUESTION) {
                        await Question.findByIdAndUpdate(comment.associatedObjectId, {
                            $set: { last_activity: Date.now() } 
                        }, { new: true });
                    }
                    else if (comment.associatedObjectType === OBJECT_TYPES.ANSWER) {
                        const answer = await Answer.findById(comment.associatedObjectId);
                        if (!answer) {
                            console.error('Answer associated with comment not found or not updated.');
                            return res.status(500).json({ success: false, error: "Answer associated with comment not found or not updated." });
                        }
                        await Question.findByIdAndUpdate(answer.qid, {
                            $set: { last_activity: Date.now() } 
                        }, { new: true });
                    } 
                    return res.status(200).json({ success: true, data: { msg: 'Vote updated successfully' } });
                } else {
                    console.error('Comment not found or not updated.');
                    return res.status(500).json({ success: false, error: "Comment not found or not updated." });
                }
            }
            default: {
                return res.status(500).json({ success: false, error: "Vote parent type is not valid" });
            }
        }

        
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
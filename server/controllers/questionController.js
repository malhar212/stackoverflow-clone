const escapeStringRegexp = require('escape-string-regexp');
const { ObjectId } = require('mongoose').Types;
const Question = require('../models/questions');
const Tag = require('../models/tags');
const User = require("../models/users");
const BuilderFactory = require('./builders/builderFactory');
const { validateLinks } = require('./hyperlinkParser');

// Function to convert database results to the desired format for UI
function formatQuestionsForUI(results) {
    const formattedQuestions = results.map(result => {
        const builder = new BuilderFactory().createBuilder({ builderType: 'questionUI' })

        const { _id, title, text, tags, asked_by, ask_date_time, views, votes, answerCount, answers } = result;
        // Extracting tag IDs
        const tagIds = tags.map(tag => tag._id);

        // Extracting answer IDs
        // const ansIds = answers.map(answer => answer._id);

        // Setting the fields using the builder pattern
        return builder
            .setQid(_id)
            .setTitle(title)
            .setText(text)
            .setTagIds(tagIds)
            .setAskedBy(asked_by)
            .setAskDate(ask_date_time)
            .setViews(views)
            .setVotes(votes)
            .setAnswerCount(answerCount)
            .setAnsIds(answers)
            .build();
    });
    return formattedQuestions
}

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        const formattedQuestions = formatQuestionsForUI(questions);
        res.status(200).json({ success: true, data: formattedQuestions });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.fetchUserQuestions = async (req, res) => {
    console.log("+++++IN FETCH USER QUESITON SBEFORE TRYYYY++++++++")
    try {
      console.log("++====FETCH USER QUESTIONS", req.session.user);
      const username = req.session.user?.username; // Use optional chaining for safer access
  
      if (!username) {
        return res.status(404).json({ success: false, error: "Username is undefined" });
      }
  
      try {
        // get the user object based on username
        const user = await User.findOne({ username });
  
        if (!user) {
          return res.status(404).json({ success: false, error: "User not found" });
        }
  
        const questions = await Question.find({ 'asked_by': user._id }).sort({ ask_date_time: -1 });
        console.log("222222222++====+FETCH USER QUESTIONS=");
        console.log(questions);
  
        return res.status(200).json({ success: true, data: questions });
      } catch (error) {
        console.error('Error fetching answers:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  };

exports.sortQuestionsByNewest = async (req, res) => {
    try {
        const questions = await Question.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "asked_by",
                    foreignField: "_id",
                    as: "asked_by",
                },
            },
            {
                $lookup: {
                    from: "answers",
                    localField: "_id",
                    foreignField: "qid",
                    as: "answers",
                },
            },
            {
                $addFields: {
                    asked_by: {
                        $arrayElemAt: ["$asked_by.username", 0],
                    },
                    answerCount: {
                        $size: "$answers",
                    },
                },
            },
            {
                $sort: {
                    ask_date_time: -1,
                },
            },
            {
                $unset:
                    "answers",
            },
        ]);
        // console.log(questions);
        const formattedQuestions = formatQuestionsForUI(questions);
        res.status(200).json({ success: true, data: formattedQuestions });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.sortQuestionsByActivity = async (req, res) => {
    try {
        const questions = await Question.aggregate([{
            $lookup: {
                from: "users",
                localField: "asked_by",
                foreignField: "_id",
                as: "asked_by",
            },
        },
        {
            $lookup: {
                from: "answers",
                localField: "_id",
                foreignField: "qid",
                as: "answers",
            },
        },
        {
            $addFields: {
                asked_by: {
                    $arrayElemAt: ["$asked_by.username", 0],
                },
                answerCount: {
                    $size: "$answers",
                },
            },
        },
        {
            $sort: {
                last_activity: -1,
            },
        },
        {
            $unset:
                "answers"
        }
        ]);
        const formattedQuestions = formatQuestionsForUI(questions);
        res.status(200).json({ success: true, data: formattedQuestions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

exports.getUnansweredQuestions = async (req, res) => {
    try {
        const questions = await Question.aggregate([{
            $lookup: {
                from: "users",
                localField: "asked_by",
                foreignField: "_id",
                as: "asked_by",
            },
        },
        {
            $lookup: {
                from: "answers",
                localField: "_id",
                foreignField: "qid",
                as: "answers",
            },
        },
        {
            $addFields: {
                asked_by: {
                    $arrayElemAt: ["$asked_by.username", 0],
                },
                answerCount: {
                    $size: "$answers",
                },
            },
        },
        {
            $sort: {
                ask_date_time: -1,
            },
        },
        {
            $unset:
                "answers"
        },
        {
            $match: {
                answerCount: 0
            }
        }
        ]);
        const formattedQuestions = formatQuestionsForUI(questions);
        res.status(200).json({ success: true, data: formattedQuestions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.search = async (req, res) => {
    try {
        const textTerms = [];
        const tagNames = [];
        const query = req.params.query;
        const sort = req.query.sort;
        if (query !== undefined && query.length > 0) {
            const searchTerms = query.match(/\[[^\]]+\]|\S+/g) || [];
            searchTerms.forEach((term) => {
                if (term.startsWith('[') && term.endsWith(']')) {
                    const tagName = term.slice(1, -1).toLowerCase();
                    tagNames.push(tagName);
                }
                else {
                    textTerms.push(term);
                }
            });
            const searchString = textTerms.join(" ");
            // Escape the search string before using it in the regex
            const escapedSearchString = escapeStringRegexp(searchString);
            let aggregation = [{
                $match: {
                    $or: [
                    ]
                }
            }, {
                $lookup: {
                    from: "users",
                    localField: "asked_by",
                    foreignField: "_id",
                    as: "asked_by",
                },
            },
            {
                $lookup: {
                    from: "answers",
                    localField: "_id",
                    foreignField: "qid",
                    as: "answers",
                },
            },
            {
                $addFields: {
                    asked_by: {
                        $arrayElemAt: ["$asked_by.username", 0],
                    },
                    answerCount: {
                        $size: "$answers",
                    },
                },
            },
            {
                $unset:
                    "answers"
            }];
            if (escapedSearchString.length > 0) {
                aggregation[0].$match.$or.push({ title: { $regex: escapedSearchString, $options: 'i' } });
                aggregation[0].$match.$or.push({ text: { $regex: escapedSearchString, $options: 'i' } });
            }
            if (tagNames.length > 0) {
                aggregation.unshift({
                    $lookup:
                    {
                        from: "tags",
                        localField: "tags",
                        foreignField: "_id",
                        as: "tags",
                    },
                });
                aggregation[1].$match.$or.push({ "tags.name": { $in: tagNames } });
            }
            if (sort === undefined || sort === "newest")
                aggregation.push({
                    $sort: { ask_date_time: -1 }
                });
            if (sort === "active")
                aggregation.push({
                    $sort: { last_activity: -1 }
                });
            if (sort === "unanswered") {
                aggregation.push({
                    $match: {
                        answerCount: 0
                    }
                });
                aggregation.push({
                    $sort: { ask_date_time: -1 }
                });
            }
            // console.log(aggregation);
            const questions = await Question.aggregate(aggregation);
            const formattedQuestions = formatQuestionsForUI(questions);
            res.status(200).json({ success: true, data: formattedQuestions });
            return;
        }
        this.sortQuestionsByNewest(req, res);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const id = req.params.id;
        if (id === undefined || id.length <= 0) {
            res.status(404).json({ success: false, error: "No QID provided" });
            return;
        }
        const question = await Question.aggregate(
            [
                {
                  $match: {
                    _id: new ObjectId(id),
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "asked_by",
                    foreignField: "_id",
                    as: "asked_by",
                  },
                },
                {
                  $addFields: {
                    asked_by: {
                      $arrayElemAt: ["$asked_by.username", 0],
                    },
                  },
                },
                {
                  $sort: {
                    ask_date_time: -1,
                  },
                },
              ]
        );
        // console.log(question);
        const formattedQuestions = formatQuestionsForUI(question);
        // console.log(formattedQuestions);
        res.status(200).json({ success: true, data: formattedQuestions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.incrementViewCount = async (req, res) => {
    try {
        const id = req.params.id;
        if (id === undefined || id.length <= 0) {
            res.status(404).json({ success: false, error: "No QID provided" });
            return;
        }
        Question.findByIdAndUpdate(id, {
            $inc: {
                views: 1
            }
        }).then(() => {
            console.log("Incremented view count");
        })
            .catch(error => {
                console.error("Error in incrementing view count: ", error.message);
            });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// '/add'
exports.addNewQuestion = async (req, res) => {
    try {
        console.log("+++++++++++ 1")
        if (req.body === undefined || req.body.question === undefined) {
            console.log("+++++++++++ 2")
            res.status(500).json({ success: false, error: "Question body not provided" });
            return;
        }
        console.log("+++++++++++ 3")
        const formData = req.body.question;
        console.log("+++++++++++ 4 "  + formData)
        const { isValid, error } = validateQuestion(formData);
        console.log("+++++++++++ 5" + isValid + error)
        if (!isValid) {
            console.log("+++++++++++ 6")
            res.status(500).json({ success: false, error });
            return;
        }
        console.log("+++++++++++ 7")
        // extracting username from formData
        const username = formData.askedBy
        console.log("+++++++++++ 8")
        // finding the user object from database based on username
        const user = await User.findOne({ username });
        console.log("+++++++++++ 9")
        let tagIds = [];
        if (formData.tags !== undefined && formData.tags.length > 0) {
            console.log("+++++++++++ 10")
            formData.tags = removeDuplicatesIgnoreCase(formData.tags);
            const result = await Tag.aggregate([
                {
                    $match: {
                        name: {
                            $in: formData.tags,
                        }, // Filter tags that match the given array
                    },
                },
                {
                    $group: {
                        _id: null,
                        // Group all matched tags
                        matchedTags: {
                            $addToSet: "$$ROOT",
                        }, // Collect matched tag names
                    },
                },
                {
                    $project: {
                        matchedTags: 1,
                        unmatchedTags: {
                            $setDifference: [
                                formData.tags,
                                "$matchedTags.name",
                            ], // Find unmatched tag names
                        },
                    },
                },
            ]);
            console.log("+++++++++++ 11")
            if (result !== undefined && result[0] !== undefined) {
                tagIds = tagIds.concat(result[0].matchedTags.map((obj) => obj._id));
                const tagsToAdd = [];
                result[0].unmatchedTags.forEach((tagName) => {
                    const tagBuilder = new BuilderFactory().createBuilder({ builderType: 'tag' });
                    tagsToAdd.push(tagBuilder.setName(tagName).build());
                })
                const insertedTags = await Tag.insertMany(tagsToAdd);
                tagIds = tagIds.concat(insertedTags);
            }
            else {
                const tagsToAdd = [];
                formData.tags.forEach((tagName) => {
                    const tagBuilder = new BuilderFactory().createBuilder({ builderType: 'tag' });
                    tagsToAdd.push(tagBuilder.setName(tagName).setCreatedBy(user).build());
                })
                const insertedTags = await Tag.insertMany(tagsToAdd);
                tagIds = tagIds.concat(insertedTags);
            }
        }
        console.log("++++++++++++++ 12")
        const qBuilder = new BuilderFactory().createBuilder({ builderType: 'question' });
        console.log("++++++++++++++ 13")
        const question = qBuilder.setTitle(formData.title).setText(formData.text).setTagIds(tagIds).setAskedBy(user).setAskDate(new Date()).build();
        console.log("++++++++++++++ 14")
        const savedQuestion = await question.save();
        res.status(200).json({ success: true, data: savedQuestion });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.updateQuestionById = async (req, res) => {
    console.log("+++UPDATE QUESITON BY ID!!!!!!!!!!!!!!!!!!!")
    console.log("question id: " + req.params);
    const { id } = req.params;
    console.log("questionId :" + id)
    const { text } = req.body;
    console.log(text)
    try {
        console.log("In the try!")
        const updatedQuestion = await Question.findByIdAndUpdate(id, { text: text }, { new: true });
        if (!updatedQuestion) {
        return res.status(404).json({ success: false, message: 'Question not found.' });
      }
      res.status(200).json({ success: true, data: updatedQuestion });
    } catch (error) {
      console.error('Error updating answer:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };





// Removes duplicates from input tags list
const removeDuplicatesIgnoreCase = (arr) => {
    const uniqueLowercaseSet = new Set(arr.map((item) => item.toLowerCase()));
    return Array.from(uniqueLowercaseSet);
}

// Helper to validate question
const validateQuestion = (formData) => {
    let isValid = true;
    let error = '';
    // Validate title
    if (formData.title === undefined || formData.title.trim() === '') {
        isValid = false;
        error = 'Title cannot be empty';
        return { isValid, error };
    } else if (formData.title.length > 100) {
        isValid = false;
        error = 'Title cannot be more than 100 characters';
        return { isValid, error };
    }

    // Validate text
    if (formData.text.trim() === '') {
        isValid = false;
        error = 'Question text cannot be empty';
        return { isValid, error };
    }

    // Validate embedded hyperlinks
    if (!validateLinks(formData.text.trim())) {
        isValid = false;
        error = 'Invalid hyperlink';
        return { isValid, error };
    }

    // Validate tags
    let tagsArray = removeDuplicatesIgnoreCase(formData.tags);
    if (tagsArray.length > 5) {
        isValid = false;
        error = 'Cannot have more than 5 tags';
        return { isValid, error };
    }

    for (const tag of tagsArray) {
        if (tag.length > 20) {
            isValid = false;
            error = 'New tag length cannot be more than 20';
            return { isValid, error };
        }
    }

    return { isValid };
}
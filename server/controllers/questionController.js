const escapeStringRegexp = require('escape-string-regexp');
const { ObjectId } = require('mongoose').Types;
const Question = require('../models/questions');
const Tag = require('../models/tags');
const BuilderFactory = require('./builders/builderFactory');
const { validateLinks } = require('./hyperlinkParser');

// Function to convert database results to the desired format for UI
function formatQuestionsForUI(results) {
    const formattedQuestions = results.map(result => {
        const builder = new BuilderFactory().createBuilder({ builderType: 'questionUI' })

        const { _id, title, text, tags, asked_by, ask_date_time, views } = result;
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

exports.sortQuestionsByNewest = async (req, res) => {
    try {
        const questions = await Question.find().sort({ ask_date_time: -1 });
        console.log(questions);
        const formattedQuestions = formatQuestionsForUI(questions);
        res.status(200).json({ success: true, data: formattedQuestions });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.sortQuestionsByRecentAnswers = async (req, res) => {
    try {
        const questions = await Question.aggregate([
            {
                $lookup: {
                    from: "answers",
                    localField: "answers",
                    foreignField: "_id",
                    as: "answers",
                },
            },
            {
                $unwind: "$answers",
            },
            {
                $sort: {
                    "answers.ans_date_time": -1,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    title: {
                        $first: "$title",
                    },
                    text: {
                        $first: "$text",
                    },
                    tags: {
                        $first: "$tags",
                    },
                    asked_by: {
                        $first: "$asked_by",
                    },
                    ask_date_time: {
                        $first: "$ask_date_time",
                    },
                    answers: {
                        $push: "$answers",
                    },
                    views: {
                        $first: "$views",
                    },
                    latestAnswer: {
                        $max: "$answers.ans_date_time",
                    },
                },
            },
            {
                $sort: {
                    "latestAnswer": -1,
                },
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
        const questions = await Question.find({ answers: { $size: 0 } }).sort({ ask_date_time: -1 });
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
            aggregation.push({
                $sort: { ask_date_time: -1 }
            });
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
                        from: "answers",
                        localField: "answers",
                        foreignField: "_id",
                        as: "answers",
                    },
                },
                {
                    $lookup: {
                        from: "tags",
                        localField: "tags",
                        foreignField: "_id",
                        as: "tags",
                    },
                },
                {
                    $sort: { ask_date_time: -1 }
                }
            ]
        );
        const formattedQuestions = formatQuestionsForUI(question);
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

exports.addNewQuestion = async (req, res) => {
    try {
        if (req.body === undefined || req.body.question === undefined) {
            res.status(500).json({ success: false, error: "Question body not provided" });
            return;
        }
        const formData = req.body.question;
        const { isValid, error } = validateQuestion(formData);
        if (!isValid) {
            res.status(500).json({ success: false, error });
            return;
        }
        let tagIds = [];
        if (formData.tags !== undefined && formData.tags.length > 0) {
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
                    tagsToAdd.push(tagBuilder.setName(tagName).build());
                })
                const insertedTags = await Tag.insertMany(tagsToAdd);
                tagIds = tagIds.concat(insertedTags);
            }
        }
        const qBuilder = new BuilderFactory().createBuilder({ builderType: 'question' });
        const question = qBuilder.setTitle(formData.title).setText(formData.text).setTagIds(tagIds).setAskedBy(formData.askedBy).setAskDate(new Date()).build();
        const savedQuestion = await question.save();
        res.status(200).json({ success: true, data: savedQuestion });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
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

    // Validate username
    if (formData.askedBy.trim() === '') {
        isValid = false;
        error = 'Username cannot be empty';
        return { isValid, error };
    }
    return { isValid };
}
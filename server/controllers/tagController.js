const { ObjectId } = require("mongodb");
const Question = require("../models/questions");
const Tag = require("../models/tags");
const BuilderFactory = require("./builders/builderFactory");

// Function to convert database results to the desired format for UI
function formatTagsForUI(results) {
  const formattedTags = results.map(result => {
    let builder = new BuilderFactory().createBuilder({ builderType: 'tagUI' });

    const { _id, name, questionCount, editable } = result;
    if (questionCount !== undefined) {
      builder = builder.setQuestionCount(questionCount);
    }
    if (editable !== undefined) {
      builder = builder.setEditable(editable);
    }
    // Setting the fields using the builder pattern
    return builder
      .setTid(_id)
      .setName(name)
      .build();
  });
  return formattedTags;
}

exports.getAllTags = async (req, res) => {
  try {
    const { ids } = req.query;
    if (ids !== undefined && ids.length > 0) {
      const idList = ids.split(',');
      if (idList.length > 0) {
        const tags = await Tag.find({ _id: { $in: idList } });
        const formattedTags = formatTagsForUI(tags);
        res.status(200).json({ success: true, data: formattedTags });
        return;
      }
    }
    const tags = await Tag.find();
    const formattedTags = formatTagsForUI(tags);
    res.status(200).json({ success: true, data: formattedTags });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTagById = async (req, res) => {
  try {
    console.log("in get TagByID " + req.params.ids)
    const ids = req.params.ids;
    if (ids === undefined || ids.length <= 0) {
      res.status(404).json({ success: false, error: "No TID provided" });
      return;
    }
    const tags = await Tag.findById(ids);
    const formattedTags = formatTagsForUI([tags]);
    res.status(200).json({ success: true, data: formattedTags });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.getTagByName = async (req, res) => {
  try {
    const name = req.params.name;
    if (name === undefined || name.length <= 0) {
      res.status(404).json({ success: false, error: "No tag name provided" });
      return;
    }
    const tags = await Tag.find({ name: name });
    const formattedTags = formatTagsForUI(tags);
    res.status(200).json({ success: true, data: formattedTags });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTagsByUsername = async (req, res) => {
  // console.log(username + "____________")
  try {
    // console.log("User object " + JSON.stringify(user, null, 3))
    const tags = await Tag.aggregate([
      {
        $match: {
          createdBy: new ObjectId(
            req.session.user.uid
          ),
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "tags",
          as: "associatedQuestions",
        },
      },
      {
        $addFields: {
          questionCount: { $size: "$associatedQuestions" },
          editable: {
            $not: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$associatedQuestions",
                      as: "question",
                      cond: {
                        $ne: [
                          "$$question.asked_by",
                          new ObjectId(
                            req.session.user.uid
                          ),
                        ],
                      },
                    },
                  },
                },
                0,
              ],
            },
          },
        },
      },
      {
        $unset:
          "associatedQuestions",
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);
    res.status(200).json({ success: true, data: formatTagsForUI(tags) });
  } catch (error) {
    console.error('Error fetching tags by user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
exports.updateTagByName = async (req, res) => {
  const { oldTagName } = req.params;
  const { name } = req.body;

  try {
    const updatedTag = await Tag.findOneAndUpdate(
      { name: oldTagName },
      { $set: { name: name } },
      { new: true }
    );

    if (!updatedTag) {
      return res.status(404).json({ success: false, message: 'Tag not found.' });
    }

    res.status(200).json({ success: true, data: updatedTag });
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getTagsAndQuestionCount = async (req, res) => {
  try {
    const tags = await Question.aggregate([
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags._id",
          name: {
            $first: "$tags.name",
          },
          questionCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1
        }
      }
    ]);
    const formattedTags = formatTagsForUI(tags);
    res.status(200).json({ success: true, data: formattedTags });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// exports.deleteByName = async (req, res) => {
//   try {
//     // console.log("In try of deleteTagByNAme +++++ " + req.params.name)
//     const name = req.params.name;
//     if (name === undefined || name.length <= 0) {
//       res.status(404).json({ success: false, error: "No tag name provided" });
//       return;
//     }
//     const result = await Tag.deleteOne({ name: name });
//     if (result.deletedCount > 0) {
//       res.status(200).json({ success: true, message: `Tag '${name}' deleted successfully` });
//     } else {
//       res.status(404).json({ success: false, error: `Tag '${name}' not found` });
//     }
//   } catch (err) {
//     console.error('Error deleting tag by name:', err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };



const deleteTagHelper = async (tagName, user) => {
  try {
    if (tagName === undefined || tagName.length <= 0) {
      return { success: false, error: "No tag name provided" };
    }

    const userObjectId = new ObjectId(user.uid);

    const aggregationPipeline = [
      {
        $match: {
          createdBy: userObjectId,
          name: tagName,
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "tags",
          as: "associatedQuestions",
        },
      },
      {
        $addFields: {
          editable: {
            $not: {
              $gt: [
                {
                  $size: {
                    $filter: {
                      input: "$associatedQuestions",
                      as: "question",
                      cond: {
                        $ne: [
                          "$$question.asked_by",
                          userObjectId,
                        ],
                      },
                    },
                  },
                },
                0,
              ],
            },
          },
        },
      },
      {
        $unset: "associatedQuestions",
      },
      {
        $sort: {
          _id: 1
        }
      }
    ];

    // Execute the aggregation pipeline
    const result = await Tag.aggregate(aggregationPipeline);
    console.log(result)
    if (result.length === 0) {
      return { success: false, error: `Tag '${tagName}' not found` };
    }

    const tagInfo = result[0];

    if (tagInfo.editable) {
      const deleteResult = await Tag.deleteOne({ _id: tagInfo._id });
      if (deleteResult.deletedCount > 0) {
        return { success: true, message: `Tag '${tagName}' deleted successfully` };
      } else {
        return { success: false, error: `Error deleting tag '${tagName}'` };
      }
    } else {
      return { success: false, error: `Tag '${tagName}' is not editable` };
    }
  } catch (err) {
    console.error('Error deleting tag by name:', err);
    return { success: false, error: err.message };
  }
};

exports.deleteByName = async (req, res) => {
  try {
    const name = req.params.name;

    const deleteResult = await deleteTagHelper(name, req.session.user);


    console.log(JSON.stringify(deleteResult, null, 4))


    if (deleteResult.success) {
      res.status(200).json(deleteResult);
    } else {
      res.status(404).json(deleteResult);
    }
  } catch (err) {
    console.error('Error deleting tag by name:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
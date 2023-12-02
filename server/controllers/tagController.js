const Question = require("../models/questions");
const Tag = require("../models/tags");
const BuilderFactory = require("./builders/builderFactory");

// Function to convert database results to the desired format for UI
function formatTagsForUI(results) {
  const formattedTags = results.map(result => {
    let builder = new BuilderFactory().createBuilder({ builderType: 'tagUI' });

    const { _id, name, questionCount } = result;
    if (questionCount !== undefined) {
      builder = builder.setQuestionCount(questionCount);
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
    const id = req.params.id;
    if (id === undefined || id.length <= 0) {
      res.status(404).json({ success: false, error: "No TID provided" });
      return;
    }
    const tags = await Tag.findById(id);
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
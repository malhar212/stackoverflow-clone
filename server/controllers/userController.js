// const Question = require("../models/questions");
const User = require("../models/users");
// const Tag = require("../models/tags");
// const BuilderFactory = require("./builders/builderFactory");

//localhost:8000/users/getUsernameByUid
//http://localhost:8000/users/getUsernameByUid?uid=656cf2553306392f5c8119e9
// uses uid to get the username
exports.getUsernameByUid = async (req, res) => {
    try { 
      const uid = req.params
      const user = await User.find(uid);
      res.status(200).json({ success: true, data: user.username  });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

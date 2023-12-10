const User = require("../models/users");

// uses uid to get the username
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.uid);
    res.status(200).json({ success: true, data: { username: user.username, reputation: user.reputation, createdAt: user.createdAt } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
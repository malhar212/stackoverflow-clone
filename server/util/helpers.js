// parseError.js
exports.parseError = function (err) {
    if (err.isJoi) return err.details[0];
    return JSON.stringify(err, Object.getOwnPropertyNames(err));
  };
  
  // sessionizeUser.js
  exports.sessionizeUser = function (user) {
    return { userId: user.id, username: user.username };
  };
const isLoggedIn = (req, res, next) => {
    // Check if the session contains information about the logged-in user
    if (req.session && req.session.user && req.session.user.uid) {
      console.log("++++++++++++++ IN ISLOGGEDIN")
      // If the session contains a userId (or any other relevant data), consider the user as logged in
      next();
    } else {
      // If the session doesn't contain the necessary information, send a 401 Unauthorized status
      console.log("++++++++++IN USER MIDDLEWARE FAIL")
      res.status(401).json({ message: 'Unauthorized: Please log in to access this resource.' });
    }
  };


module.exports = isLoggedIn;
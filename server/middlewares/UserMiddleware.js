const User = require("../models/users");

const isLoggedIn = async (req, res, next) => {
  // Check if the session contains information about the logged-in user
  // console.log("+++ ISLOGGEDIN MIDDLEWARE ++++ ")
  if (req.session && req.session.user && req.session.user.uid && req.session.user.uid.trim().length > 0) {
    try {
      // Find a user by their ID
      const user = await User.findById(req.session.user.uid);

      if (user) {

        console.log('User found:', user);
        req.user = user; 

        // User exists
        next();
      } else {
        // console.log('User not found');
        res.status(401).json({ message: 'Unauthorized: Please log in to access this resource.' });
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      res.status(401).json({ message: 'Unauthorized: Please log in to access this resource.' });
    }
  } else {
    // console.log(req.session);
    // If the session doesn't contain the necessary information, send a 401 Unauthorized status
    // console.log("++++++++++IN USER MIDDLEWARE FAIL")
    res.status(401).json({ message: 'Unauthorized: Please log in to access this resource.' });
  }
};


module.exports = isLoggedIn;
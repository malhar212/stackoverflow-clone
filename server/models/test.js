const mongoose = require('mongoose');
const User = require('./users.js');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/your-database-name', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a new user
const newUser = new User({
    username: 'exampleUser',
    password: 'examplePassword'
});

// Save the user to the database using promises
newUser.save()
    .then(() => {
        // Find the user and test password comparison
        return User.findOne({ username: 'exampleUser' });
    })
    .then((user) => {
        // Compare passwords
        return user.comparePassword('examplePassword');
    })
    .then((isMatch) => {
        console.log('Password Match:', isMatch); // Should print true

        // Close the connection after finishing operations
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error('Error:', err);
    });
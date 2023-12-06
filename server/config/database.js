const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connect();
    this.connection = mongoose.connection;
  }  
  connect() {
    mongoose.connect('mongodb://127.0.0.1:27017/fake_so', {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      family: 4
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
      console.log('Connected to MongoDB');
    });
  }
}

module.exports = new Database();
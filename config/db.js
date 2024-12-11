const mongoose = require('mongoose');

// Connection URI for MongoDB
const dbURI = 'mongodb://localhost:27017/fmdb';

// Configuration options for Mongoose (without deprecated options)
const options = {
  connectTimeoutMS: 30000,  // Increase connection timeout to 30 seconds
  socketTimeoutMS: 30000    // Increase socket timeout to 30 seconds
};

// Connect to MongoDB
mongoose.connect(dbURI, options);
//LOG FILE LOCATION C:\Program Files\MongoDB\Server\8.0\log\
// Event listeners for MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected to ' + dbURI);
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error: ' + err);
  process.exit(1);  // Exit process on database connection error
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose is disconnected');
});

// Export the Mongoose connection to use in other parts of your app
module.exports = mongoose;

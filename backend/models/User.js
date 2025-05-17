const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profilePic: String, // Stores filename of the uploaded pic
});

module.exports = mongoose.model('User', UserSchema);

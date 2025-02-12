const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {type: String, required: true},
  empresa: {type: String, required: true},
  permiss: {type: String, required: true},
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

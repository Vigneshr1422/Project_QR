const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phone: { type: String, required: true, unique: true }, // 💥 Make phone unique
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

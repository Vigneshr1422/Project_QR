const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  table: { type: String, required: true, unique: true },
  image: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('QRCode', qrCodeSchema);

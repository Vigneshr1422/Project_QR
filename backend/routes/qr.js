const express = require('express');
const router = express.Router();
const QR = require('../models/QRCode');
const fs = require('fs');
const path = require('path');

// Helper to decode base64 and save image to disk
const saveBase64Image = (base64Image, filePath) => {
  // Remove header from base64 string
  const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(filePath, base64Data, 'base64');
};

// Create folder if not exists
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 📌 POST /api/save-qr
router.post('/save-qr', async (req, res) => {
  const { table, image } = req.body;

  if (!table || !image) {
    return res.status(400).json({ message: 'Table or image missing' });
  }

  try {
    const existing = await QR.findOne({ table });
    if (existing) {
      return res.status(400).json({ message: 'QR for this table already exists' });
    }

    const qrDir = path.join(__dirname, '..', 'QRCodes', table);
    ensureDirectoryExists(qrDir);

    const filePath = path.join(qrDir, `${table}.png`);
    saveBase64Image(image, filePath);

    const imagePath = `/QRCodes/${table}/${table}.png`;

    const newQR = new QR({ table, image: imagePath });
    await newQR.save();

    res.json({ message: 'QR code saved successfully', imagePath });
  } catch (err) {
    console.error('❌ Error saving QR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📌 GET /api/get-all-qr
router.get('/get-all-qr', async (req, res) => {
  try {
    const qrCodes = await QR.find().sort({ createdAt: -1 });
    res.json(qrCodes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch QR codes' });
  }
});

// 📌 DELETE /api/delete-qr/:id
router.delete('/delete-qr/:id', async (req, res) => {
  try {
    const qr = await QR.findById(req.params.id);
    if (!qr) return res.status(404).json({ message: 'QR not found' });

    const fullPath = path.join(__dirname, '..', qr.image);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath); // delete the image file
    }

    await QR.findByIdAndDelete(req.params.id);
    res.json({ message: 'QR deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete QR' });
  }
});

// 📌 PUT /api/update-qr/:id (Optional)
router.put('/update-qr/:id', async (req, res) => {
  const { table, image } = req.body;
  try {
    const updated = await QR.findByIdAndUpdate(req.params.id, { table, image }, { new: true });
    res.json({ message: 'QR updated', updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update QR' });
  }
});

module.exports = router;

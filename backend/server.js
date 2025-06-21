const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user'); // ✅ already present
const qrRoutes = require('./routes/qr');     // ✅ ADD this line
const contact = require('./routes/contact');

const path = require('path');                // ✅ Needed for serving images
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static QR code images
app.use('/QRCodes', express.static(path.join(__dirname, 'QRCodes'))); // ✅

mongoose.connect('mongodb://127.0.0.1:27017/zerve', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api', qrRoutes); // ✅ Make sure this works now
app.use('/api/user', userRoutes); // ✅ Optional if using user routes
app.use('/api/contact', require('./routes/contact'));


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

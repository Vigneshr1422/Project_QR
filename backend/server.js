const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env

const userRoutes = require('./routes/user');
const qrRoutes = require('./routes/qr');
const contactRoutes = require('./routes/contact');
const userOrderRoutes = require('./routes/userOrderRoutes');
const paymentRoutes = require('./routes/payment');
const otpRoutes = require('./routes/otp');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
console.log("👉 Render sees this MONGO_URI:", process.env.MONGO_URI);
console.log("👉 MONGO_URI Render is using:", process.env.MONGO_URI || "MISSING ENV VALUE");
// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB error:', err));

// Routes
app.use('/api/user', userRoutes);
app.use('/api', qrRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/user-orders', userOrderRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api', paymentRoutes);

// Static folder for QR codes
app.use('/QRCodes', express.static(path.join(__dirname, 'QRCodes')));


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

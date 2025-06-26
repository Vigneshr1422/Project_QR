const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = 'c8680c3c-518c-11f0-a562-0200cd936042'; // Your 2Factor API key

// ✅ Send OTP (with AUTOGEN)
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ success: false, message: 'Phone number required' });

  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${API_KEY}/SMS/${phone}/AUTOGEN`
    );

    if (response.data.Status === 'Success') {
      return res.json({ success: true, sessionId: response.data.Details });
    } else {
      return res.status(400).json({ success: false, message: 'Failed to send OTP' });
    }
  } catch (err) {
    console.error('Send OTP error:', err.message);
    res.status(500).json({ success: false, message: 'Server error sending OTP' });
  }
});

// ✅ Verify OTP (using sessionId)
router.post('/verify-otp', async (req, res) => {
  const { otp, sessionId } = req.body;

  if (!otp || !sessionId) {
    return res.status(400).json({ success: false, message: 'OTP and sessionId required' });
  }

  try {
    const verifyResponse = await axios.get(
      `https://2factor.in/API/V1/${API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    );

    if (verifyResponse.data.Status === 'Success') {
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('Verify OTP error:', err.message);
    res.status(500).json({ success: false, message: 'Server error verifying OTP' });
  }
});

module.exports = router;

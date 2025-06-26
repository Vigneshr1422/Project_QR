const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config(); // 👈 Load .env variables

const SERVICE_SID = process.env.TWILIO_VERIFY_SID;

const TWILIO_AUTH = {
  username: process.env.TWILIO_ACCOUNT_SID,
  password: process.env.TWILIO_AUTH_TOKEN,
};

// Send OTP
const qs = require('querystring');

router.post('/send-otp', async (req, res) => {
  const { phone, channel } = req.body;
  console.log("Received phone:", phone);

  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number missing" });
  }

  try {
    const result = await axios.post(
      `https://verify.twilio.com/v2/Services/${SERVICE_SID}/Verifications`,
      new URLSearchParams({
        To: phone,
        Channel: channel || 'sms',
      }),
      {
        auth: TWILIO_AUTH,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // ✅ Required
        },
      }
    );

    res.json({ success: true, sid: result.data.sid });
  } catch (err) {
    console.error('Send OTP error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'OTP sending failed' });
  }
});


router.post('/verify-otp', async (req, res) => {
  const { phone, otp: code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ success: false, message: 'Phone or OTP missing' });
  }

  try {
    const result = await axios.post(
      `https://verify.twilio.com/v2/Services/${SERVICE_SID}/VerificationCheck`,
      new URLSearchParams({
        To: phone,
        Code: code,
      }),
      {
        auth: TWILIO_AUTH,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // ✅ required
        },
      }
    );

    if (result.data.status === 'approved') {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    console.error('Verify OTP error:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
});



module.exports = router;

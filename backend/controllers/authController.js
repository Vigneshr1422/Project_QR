exports.verifyOtp = async (req, res) => {
  const { phone, otp, username } = req.body;

  // Check OTP
  if (otpStore[phone] !== parseInt(otp)) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // Clear OTP
  delete otpStore[phone];

  // Admin flow
  if (phone === process.env.ADMIN_PHONE) {
    return res.status(200).json({ role: 'admin' });
  }

  // User flow
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ username, phone });
  }

  return res.status(200).json({ role: 'user', user });
};

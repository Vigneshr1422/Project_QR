import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [stage, setStage] = useState(0); // 0 = login, 1 = OTP
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [sentOtp, setSentOtp] = useState('');
  const navigate = useNavigate();

  const toggleLogin = () => setShowLogin(true);
  const closeLogin = () => {
    setShowLogin(false);
    setStage(0);
    setUsername('');
    setPhone('');
    setOtp(['', '', '', '', '', '']);
  };

  const sendOtp = () => {
    if (!phone) return alert("Please enter phone number.");
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(generatedOtp);
    console.log("Generated OTP:", generatedOtp);
    alert("OTP sent! Check console.");
    setStage(1);
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ''); // only digits
    if (value.length > 1) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    // auto focus next box
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };
const verifyOtp = async () => {
  const enteredOtp = otp.join('');

  if (enteredOtp !== sentOtp) {
    return alert('Invalid OTP');
  }

  try {
    const res = await fetch('http://localhost:5000/api/user/save-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, phone }),
    });

    const data = await res.json();

    if (!data.success) {
      console.warn("Server responded:", data.message); // log reason
      return alert("User save failed! " + data.message);
    }
  } catch (err) {
    console.error("Error saving user:", err);
    return alert("Server error. Try again.");
  }

  closeLogin(); // ✅ Close modal first

  if (phone === '6380792434') {
    navigate('/admin');
  } else {
    alert(`Welcome ${username}!`);
  }
};


  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <img src="/src/assets/zervepic.png" alt="Zerve Logo" className="h-16 w-auto" />
          <span className="text-3xl font-extrabold text-[#660033] tracking-wide">zerve</span>
        </div>

        <nav className="flex space-x-8 text-gray-700 font-medium text-lg">
          <a href="#home" className="hover:text-black">Home</a>
          <a href="#menu" className="hover:text-black">Menu</a>
          <a href="#order" className="hover:text-black">Order</a>
          <a href="#pay" className="hover:text-black">Pay</a>
          <a href="#bill" className="hover:text-black">Bill</a>
        </nav>

        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-semibold text-base">
            Seat No: <span className="text-black">A12</span>
          </span>
          <FaUserCircle
            className="text-3xl text-gray-700 cursor-pointer hover:text-black transition"
            onClick={toggleLogin}
          />
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={closeLogin}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-center text-[#660033] mb-6">Login</h2>

            {stage === 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#660033]"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#660033]"
                  />
                </div>
                <button
                  onClick={sendOtp}
                  className="w-full bg-[#660033] text-white py-2 rounded hover:bg-pink-800 transition"
                >
                  Send OTP
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <label className="block text-gray-700 font-medium text-center">Enter 6-digit OTP</label>
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      className="w-10 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#660033]"
                      maxLength={1}
                    />
                  ))}
                </div>
                <button
                  onClick={verifyOtp}
                  className="w-full bg-[#660033] text-white py-2 rounded hover:bg-pink-800 transition"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

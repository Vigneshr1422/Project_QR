import React, { useState, useContext, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import imagePaths from '../assets/imagePaths';
import { UserContext } from '../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import { GiFruitBowl } from 'react-icons/gi';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    setIsLoggedIn,
    username,
    setUsername,
    phone,
    setPhone,
    showLogin,
    setShowLogin
  } = useContext(UserContext);

  const [stage, setStage] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [sessionId, setSessionId] = useState(''); // ✅ NEW
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem('isLoggedIn') === 'true';
    const savedUsername = localStorage.getItem('username');
    const savedPhone = localStorage.getItem('phone');

    if (savedLogin && savedUsername && savedPhone) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
      setPhone(savedPhone);
    }
  }, []);

  const toggleLogin = () => {
    if (!isLoggedIn) setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
    setStage(0);
    setPhone('');
    setUsername('');
    setOtp(['', '', '', '', '', '']);
    setSessionId('');
  };

  const sendOtp = async () => {
    if (!phone) return toast.error("Please enter phone number.");
    if (!/^\d{10}$/.test(phone)) return toast.error("Enter valid 10-digit phone number");

    try {
      const res = await fetch('http://localhost:5000/api/otp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (data.success) {
        setSessionId(data.sessionId); // ✅ Save session ID
        setStage(1);
        toast.success("OTP sent!");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      toast.error("Network or server error");
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, '');
    if (value.length > 1) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) return toast.error("Enter 6-digit OTP");
    if (!sessionId) return toast.error("Session expired. Please resend OTP.");

    try {
      const res = await fetch('http://localhost:5000/api/otp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, otp: enteredOtp }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Invalid OTP");
        return;
      }

      await fetch('https://order-qr.onrender.com/api/user/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone }),
      });

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      localStorage.setItem('phone', phone);

      setIsLoggedIn(true);
      closeLogin();

      const previousPath = window.location.pathname;
      phone === '6380792434'
        ? navigate('/admin')
        : navigate(previousPath === '/order' ? '/order' : '/menu');
    } catch (err) {
      console.error("Verify OTP error:", err);
      toast.error("Error verifying OTP");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPhone('');
    localStorage.clear();
    setShowProfileDropdown(false);
    navigate('/home');
  };

  return (
    <>
      <div id="recaptcha-container"></div>
      <ToastContainer />
      <header className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 bg-white shadow-md sticky top-0 z-50 relative">
        {/* Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <img src={imagePaths.zervepic} alt="Zerve Logo" className="h-12 sm:h-14 w-auto" />
          <span className="text-2xl sm:text-3xl font-extrabold text-[#660033] tracking-wide">Dessert-Tap </span>
        </div>

        {/* Desktop Nav */}
       <nav className="hidden md:flex space-x-4 sm:space-x-6 text-gray-700 font-medium text-sm sm:text-base md:text-lg">
  <Link to="/" className="hover:text-black transition duration-300">Home</Link>
  <Link to="/menu" className="hover:text-black transition duration-300">Menu</Link>
  <Link to="/menu" state={{ scrollTo: 'jigarthanda-menu' }} className="hover:text-black">Order</Link>
  <Link to="/about" className="hover:text-black transition duration-300">About</Link>
    <Link to="/all-qrs" className="hover:text-black transition duration-300">Table</Link>

</nav>


        {/* Mobile Icons (Menu + User) */}
        <div className="flex items-center space-x-4 md:hidden relative">
          <button className="text-3xl text-orange-500" onClick={() => setShowMobileMenu(prev => !prev)}>
            <GiFruitBowl />
          </button>
          <FaUserCircle
            className="text-3xl text-gray-700 cursor-pointer hover:text-black"
            onClick={() => {
              if (isLoggedIn) {
                setShowProfileDropdown(!showProfileDropdown);
              } else {
                toggleLogin();
              }
            }}
          />
          {/* Mobile Dropdown */}
          {isLoggedIn && showProfileDropdown && (
            <div className="absolute right-0 top-12 bg-white shadow-lg rounded border w-36 z-50">
              <div className="px-3 py-2 text-gray-800 font-medium border-b text-sm">{username}</div>
              <button
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Desktop User & Seat No */}
        <div className="hidden md:flex items-center space-x-3 sm:space-x-4">
          <span className="text-gray-700 font-semibold text-sm sm:text-base">
            Seat No: <span className="text-black">{localStorage.getItem('seat') || '-'}</span>
          </span>
          <div className="relative">
            <FaUserCircle
              className="text-2xl sm:text-3xl text-gray-700 cursor-pointer hover:text-black transition"
              onClick={() => {
                if (isLoggedIn) {
                  setShowProfileDropdown(!showProfileDropdown);
                } else {
                  toggleLogin();
                }
              }}
            />
            {isLoggedIn && showProfileDropdown && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded border w-36 sm:w-40 z-50">
                <div className="px-3 py-2 text-gray-800 font-medium border-b text-sm sm:text-base">{username}</div>
                <button
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 text-sm sm:text-base"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
<div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${showMobileMenu ? 'max-h-60 py-4' : 'max-h-0'} bg-white text-center border-b shadow`}>
  <Link to="/" className="block py-2 text-lg text-gray-700" onClick={() => setShowMobileMenu(false)}>Home</Link>
  <Link to="/menu" className="block py-2 text-lg text-gray-700" onClick={() => setShowMobileMenu(false)}>Menu</Link>
  <Link to="/menu" state={{ scrollTo: 'jigarthanda-menu' }} className="block py-2 text-lg text-gray-700" onClick={() => setShowMobileMenu(false)}>Order</Link>
  <Link to="/about" className="block py-2 text-lg text-gray-700" onClick={() => setShowMobileMenu(false)}>About</Link>
    <Link to="/all-qrs" className="block py-2 text-lg text-gray-700" onClick={() => setShowMobileMenu(false)}>Table</Link>

</div>


      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-2">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl" onClick={closeLogin}>
              &times;
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-center text-[#660033] mb-6">Login</h2>

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
  onClick={async () => {
    setLoading(true);
    await sendOtp(); // or just call sendOtp(); and stop loading inside it.
    setLoading(false);
  }}
  className="w-full bg-[#660033] text-white py-2 rounded hover:bg-pink-800 transition flex items-center justify-center"
>
  {loading ? (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
  ) : (
    "Send OTP"
  )}
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
    name={`otp-${index}-${Date.now()}`} // ⛔ dynamic name blocks autofill
    type="text"
autoComplete="one-time-code"
    inputMode="numeric" // 👈 best for mobile keypad
    value={digit}
    onChange={(e) => handleOtpChange(e, index)}
    className="w-10 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#660033]"
    maxLength={1}
  />
))}

                </div>
               <button
  onClick={async () => {
    setVerifying(true);
    await verifyOtp();
    setVerifying(false);
  }}
  className="w-full bg-[#660033] text-white py-2 rounded hover:bg-pink-800 transition flex items-center justify-center"
>
  {verifying ? (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
  ) : (
    "Submit"
  )}
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQrcode, FaUserShield, FaClipboardList } from 'react-icons/fa';

const Admin = () => {
  const navigate = useNavigate();
  const [loadingOrders, setLoadingOrders] = useState(false); // 👈 loading state

  const handleViewOrders = () => {
    setLoadingOrders(true);
    setTimeout(() => {
      navigate('/admin-orders');
    }, 1000); // optional delay to show animation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF0F5] via-[#FFE5EC] to-[#FFF8F2] flex flex-col items-center justify-center px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <FaUserShield className="text-[#660033] text-6xl animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#660033]">Admin Dashboard 🚀</h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Manage all your restaurant tools in one place
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-6">
        <button
          onClick={() => navigate('/qrcode')}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-[#660033] to-[#B83280] text-white text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300"
        >
          <FaQrcode className="text-white text-xl" />
          QR Code Management
        </button>

        <button
          onClick={handleViewOrders}
          disabled={loadingOrders}
          className={`w-full flex items-center justify-center gap-3 px-6 py-3 ${
            loadingOrders ? 'bg-gray-400' : 'bg-gradient-to-r from-[#660033] to-[#FF69B4]'
          } text-white text-lg font-semibold rounded-full shadow-lg transition-all duration-300`}
        >
          {loadingOrders ? (
            <>
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
              Loading...
            </>
          ) : (
            <>
              <FaClipboardList className="text-white text-xl" />
              View All Orders
            </>
          )}
        </button>
      </div>

      {/* Logout */}
      <div className="mt-12">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-900 transition-all duration-300 shadow-sm"
        >
          ⬅️ Logout
        </button>
      </div>
    </div>
  );
};


export default Admin;

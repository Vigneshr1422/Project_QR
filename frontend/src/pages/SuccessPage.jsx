import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SuccessPage = () => {
  const [paymentDone, setPaymentDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  useEffect(() => {
    if (paymentDone) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentDone, navigate]);

  const handlePayment = () => {
    const totalAmount = localStorage.getItem('lastOrderAmount') || 100;
    const username = localStorage.getItem('username') || "Guest";
    const phone = localStorage.getItem('phone') || "0000000000";
    const tableId = localStorage.getItem('tableId') || "N/A";

    const options = {
      key: 'rzp_test_530IhtklR4H6Wt',
      amount: totalAmount * 100,
      currency: "INR",
      name: "Zerve",
      description: `Payment for Table ${tableId}`,
      handler: function (response) {
        toast.success("🎉 Payment Successful!");

        const payload = {
          username,
          phone,
          tableId,
          amountPaid: totalAmount,
          paymentId: response.razorpay_payment_id,
        };

        fetch('https://desserttap.onrender.com/api/save-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              console.log("💾 Payment saved to DB");
              setPaymentDone(true);
            } else {
              console.error("❌ Failed to save payment", data.error);
              toast.error("❌ Failed to save payment in DB");
            }
          })
          .catch(err => {
            console.error("❌ Backend error", err);
            toast.error("⚠️ Server error while saving payment");
          });
      },
      prefill: {
        name: username,
        contact: phone,
      },
      notes: { tableId },
      theme: { color: "#660033" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFFCFA] text-[#660033] px-4">
      <ToastContainer position="top-center" autoClose={2000} />
      {paymentDone ? (
        <>
          <h1 className="text-4xl font-bold mb-4">🎉 Order Placed!</h1>
          <p className="text-lg mb-2">Thank you for ordering from Zerve!</p>
          <p className="text-md mb-6">You’ll be redirected in <b>{formatTime(timeLeft)}</b></p>
          <button
            onClick={() => navigate('/')}
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
          >
            ⬅️ Back to Menu Now
          </button>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-semibold mb-6">Complete Your Payment</h1>
          <button
            onClick={handlePayment}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            💳 Pay Now with Razorpay
          </button>
        </>
      )}
    </div>
  );
};

export default SuccessPage;

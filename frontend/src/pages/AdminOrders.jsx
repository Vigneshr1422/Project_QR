import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true); // 🔁 Loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://order-qr.onrender.com/api/user-orders/admin/all-orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const grouped = {};
          data.orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(order);
          });

          setGroupedOrders(grouped);
        } else {
          alert('Failed to load orders');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Server error');
      })
      .finally(() => {
        setLoading(false); // ✅ Stop loading once everything is done
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F2] px-4 md:px-10 py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#660033]">📋 All Orders</h2>
      </div>

      {/* 🔄 Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20 text-[#660033]">
          <svg
            className="animate-spin h-8 w-8 mb-3"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="text-lg font-medium">Loading orders...</p>
        </div>
      ) : Object.keys(groupedOrders).length === 0 ? (
        <p className="text-center text-gray-500 mt-20">No orders found.</p>
      ) : (
        Object.entries(groupedOrders).map(([date, ordersOnDate]) => (
          <div key={date} className="mb-10">
            <h3 className="text-xl font-bold text-[#660033] mb-4">📅 {date}</h3>

            <div className="overflow-x-auto rounded-xl shadow-md border border-[#EDDADA]">
              <table className="min-w-[600px] w-full bg-white text-sm">
                <thead className="bg-[#FBECEC] text-[#660033] text-left">
                  <tr>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Table</th>
                    <th className="px-4 py-2">Items</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersOnDate.map((order, idx) => (
                    <tr key={idx} className="border-t border-[#F2E5E5] hover:bg-[#FFF0F0]">
                      <td className="px-4 py-3 text-gray-700">
                        {order.username} <br />({order.phone})
                      </td>
                      <td className="px-4 py-3 font-medium text-[#660033]">{order.tableId}</td>
                      <td className="px-4 py-3">
                        {order.cartItems.map((item, i) => (
                          <div key={i}>
                            {item.name} x {item.quantity} – ₹{item.price}
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-[#FFA00] font-bold">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* ⬅️ Back Button */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-900"
        >
          <FaArrowLeft /> Back to Admin
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const tableId = location.state?.tableId ?? localStorage.getItem('tableId');

  useEffect(() => {
    if (!tableId) {
      toast.error("❗ Missing Table ID. Please scan QR again.");
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, [tableId]);

  const getNumericPrice = (priceStr) => parseFloat(priceStr.replace(/[^\d.]/g, ''));

  const totalAmount = cartItems.reduce(
    (total, item) => total + getNumericPrice(item.price) * (item.quantity || 1),
    0
  );

  const handleConfirmOrder = async () => {
    const username = localStorage.getItem('username');
    const phone = localStorage.getItem('phone');

    if (!username || !phone || !tableId || cartItems.length === 0) {
      toast.warn("❗ Missing order info. Please login and try again.");
      return;
    }

    const cleanedCartItems = cartItems.map(({ name, price, quantity }) => ({ name, price, quantity }));

    const payload = {
      tableId,
      username,
      phone,
      cartItems: cleanedCartItems,
      totalAmount,
    };

    try {
      const res = await fetch('https://order-qr.onrender.com/api/user-orders/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('✅ Order Placed Successfully!');
        localStorage.removeItem('cart');
        localStorage.setItem('lastOrderAmount', totalAmount);
        setTimeout(() => navigate('/success'), 1500);
      } else {
        toast.error('❌ Order failed. Try again.');
      }
    } catch (err) {
      console.error('❌ Server error:', err);
      toast.error('⚠️ Server error. Try again later.');
    }
  };

  const updateQuantity = (index, delta) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = Math.max(1, updatedItems[index].quantity + delta);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    toast.info("🗑️ Item removed from cart.");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F2] px-4 md:px-20 py-10">
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar newestOnTop />
      <h2 className="text-4xl font-extrabold text-[#660033] mb-6 text-center">🧾 Order Summary</h2>

      {tableId && (
        <p className="mb-6 text-center text-gray-600 text-sm">
          Table: <span className="font-bold text-[#660033]">{tableId}</span>
        </p>
      )}

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">No items in cart.</p>
      ) : (
        <div className="rounded-2xl shadow-lg">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-[#E0CFCF] rounded-2xl overflow-hidden">
              <thead className="bg-[#FBECEC] text-[#660033] uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Item</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4 text-center">Unit Price</th>
                  <th className="px-6 py-4 text-center">Total</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {cartItems.map((item, index) => {
                  const unitPrice = getNumericPrice(item.price);
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <tr key={index} className="border-b border-[#F2E5E5] hover:bg-[#FFF0F0] transition">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-32 h-32 rounded-2xl object-cover border-2 shadow-md" />
                        <div>
                          <div className="font-semibold text-[#660033]">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.desc}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <button onClick={() => updateQuantity(index, -1)} className="bg-[#f0d6d6] hover:bg-[#e9bcbc] text-[#660033] rounded-full p-1">
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(index, 1)} className="bg-[#f0d6d6] hover:bg-[#e9bcbc] text-[#660033] rounded-full p-1">
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">₹{unitPrice}</td>
                      <td className="px-6 py-4 text-center font-semibold text-[#FFA00]">₹{itemTotal}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-[#FBECEC] font-bold text-[#660033] text-sm">
                  <td colSpan="3" className="px-6 py-4 text-right">Grand Total:</td>
                  <td className="px-6 py-4 text-center">₹{totalAmount.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {cartItems.map((item, index) => {
              const unitPrice = getNumericPrice(item.price);
              const itemTotal = unitPrice * item.quantity;

              return (
                <div key={index} className="bg-white rounded-xl p-4 shadow-md border border-[#EDDADA]">
                  <div className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover border" />
                    <div className="flex-1">
                      <div className="font-semibold text-[#660033]">{item.name}</div>
                      <p className="text-xs text-gray-500 mb-1">{item.desc}</p>
                      <p className="text-sm">Price: ₹{unitPrice}</p>
                      <p className="text-sm font-medium text-[#FFA00]">Total: ₹{itemTotal}</p>
                    </div>
                    <button onClick={() => handleRemoveItem(index)} className="text-red-500 self-start">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex justify-center mt-3">
                    <div className="inline-flex items-center gap-3">
                      <button onClick={() => updateQuantity(index, -1)} className="bg-[#f0d6d6] text-[#660033] rounded-full p-1">
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, 1)} className="bg-[#f0d6d6] text-[#660033] rounded-full p-1">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="text-right font-bold text-[#660033] text-lg mt-4">
              Total: ₹{totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleConfirmOrder}
            className="bg-[#660033] text-white px-8 py-3 rounded-full hover:bg-[#880044] transition-all duration-300 shadow-lg hover:scale-105"
          >
            ✅ Confirm Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Order;

// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Minus, Plus, Trash2 } from 'lucide-react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Order = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [cartItems, setCartItems] = useState([]);
//   const tableId = location.state?.tableId ?? localStorage.getItem('tableId');

//   useEffect(() => {
//     if (!tableId) {
//       toast.error("❗ Missing Table ID. Please scan QR again.");
//       setTimeout(() => navigate('/'), 2000);
//       return;
//     }

//     const storedCart = localStorage.getItem('cart');
//     if (storedCart) {
//       setCartItems(JSON.parse(storedCart));
//     }
//   }, [tableId]);

//   const getNumericPrice = (priceStr) => parseFloat(priceStr.replace(/[^\d.]/g, ''));

//   const totalAmount = cartItems.reduce(
//     (total, item) => total + getNumericPrice(item.price) * (item.quantity || 1),
//     0
//   );

//   const handleConfirmOrder = async () => {
//     const username = localStorage.getItem('username');
//     const phone = localStorage.getItem('phone');

//     if (!username || !phone || !tableId || cartItems.length === 0) {
//       toast.warn("❗ Missing order info. Please login and try again.");
//       return;
//     }

//     const cleanedCartItems = cartItems.map(({ name, price, quantity }) => ({ name, price, quantity }));

//     const payload = {
//       tableId,
//       username,
//       phone,
//       cartItems: cleanedCartItems,
//       totalAmount,
//     };

//     try {
//       const res = await fetch('https://order-qr.onrender.com/api/user-orders/submit', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       if (data.success) {
//         toast.success('✅ Order Placed Successfully!');
//         localStorage.removeItem('cart');
//         localStorage.setItem('lastOrderAmount', totalAmount);
//         setTimeout(() => navigate('/success'), 1500);
//       } else {
//         toast.error('❌ Order failed. Try again.');
//       }
//     } catch (err) {
//       console.error('❌ Server error:', err);
//       toast.error('⚠️ Server error. Try again later.');
//     }
//   };

//   const updateQuantity = (index, delta) => {
//     const updatedItems = [...cartItems];
//     updatedItems[index].quantity = Math.max(1, updatedItems[index].quantity + delta);
//     setCartItems(updatedItems);
//     localStorage.setItem('cart', JSON.stringify(updatedItems));
//   };

//   const handleRemoveItem = (index) => {
//     const updatedItems = [...cartItems];
//     updatedItems.splice(index, 1);
//     setCartItems(updatedItems);
//     localStorage.setItem('cart', JSON.stringify(updatedItems));
//     toast.info("🗑️ Item removed from cart.");
//   };

//   return (
//     <div className="min-h-screen bg-[#FFF8F2] px-4 md:px-20 py-10">
//       <h2 className="text-4xl font-extrabold text-[#660033] mb-6 text-center">🧾 Order Summary</h2>

//       {tableId && (
//         <p className="mb-6 text-center text-gray-600 text-sm">
//           Table: <span className="font-bold text-[#660033]">{tableId}</span>
//         </p>
//       )}

//      {cartItems.length === 0 ? (
//   <p className="text-center text-gray-500 mt-20">No items in cart.</p>
// ) : (
//   <div className="rounded-2xl shadow-lg">
//     {/* 🖥️ Table View for Desktop */}
//     <div className="hidden md:block overflow-x-auto">
//       <table className="min-w-full bg-white border border-[#E0CFCF] rounded-2xl overflow-hidden">
//         <thead className="bg-[#FBECEC] text-[#660033] uppercase text-xs tracking-wider">
//           <tr>
//             <th className="px-6 py-4 text-left">Item</th>
//             <th className="px-6 py-4 text-center">Qty</th>
//             <th className="px-6 py-4 text-center">Unit Price</th>
//             <th className="px-6 py-4 text-center">Total</th>
//             <th className="px-6 py-4 text-center">Action</th>
//           </tr>
//         </thead>
//         <tbody className="text-sm">
//           {cartItems.map((item, index) => {
//             const unitPrice = getNumericPrice(item.price);
//             const itemTotal = unitPrice * item.quantity;

//             return (
//               <tr key={index} className="border-b border-[#F2E5E5] hover:bg-[#FFF0F0] transition">
//                 <td className="px-6 py-4 flex items-center gap-4">
//                   <img src={item.image} alt={item.name} className="w-32 h-32 rounded-2xl object-cover border-2 shadow-md" />
//                   <div>
//                     <div className="font-semibold text-[#660033]">{item.name}</div>
//                     <div className="text-xs text-gray-500">{item.desc}</div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-center">
//                   <div className="inline-flex items-center gap-2">
//                     <button onClick={() => updateQuantity(index, -1)} className="bg-[#f0d6d6] hover:bg-[#e9bcbc] text-[#660033] rounded-full p-1">
//                       <Minus size={14} />
//                     </button>
//                     <span className="text-sm font-medium">{item.quantity}</span>
//                     <button onClick={() => updateQuantity(index, 1)} className="bg-[#f0d6d6] hover:bg-[#e9bcbc] text-[#660033] rounded-full p-1">
//                       <Plus size={14} />
//                     </button>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 text-center">₹{unitPrice}</td>
//                 <td className="px-6 py-4 text-center font-semibold text-[#FFA00]">₹{itemTotal}</td>
//                 <td className="px-6 py-4 text-center">
//                   <button onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
//                     <Trash2 size={18} />
//                   </button>
//                 </td>
//               </tr>
//             );
//           })}
//           <tr className="bg-[#FBECEC] font-bold text-[#660033] text-sm">
//             <td colSpan="3" className="px-6 py-4 text-right">Grand Total:</td>
//             <td className="px-6 py-4 text-center">₹{totalAmount.toFixed(2)}</td>
//             <td></td>
//           </tr>
//         </tbody>
//       </table>
//     </div>

//     {/* 📱 Card View for Mobile */}
//     <div className="md:hidden flex flex-col gap-4">
//       {cartItems.map((item, index) => {
//         const unitPrice = getNumericPrice(item.price);
//         const itemTotal = unitPrice * item.quantity;

//         return (
//           <div key={index} className="bg-white rounded-xl p-4 shadow-md border border-[#EDDADA]">
//             <div className="flex gap-4">
//               <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover border" />
//               <div className="flex-1">
//                 <div className="font-semibold text-[#660033]">{item.name}</div>
//                 <p className="text-xs text-gray-500 mb-1">{item.desc}</p>
//                 <p className="text-sm">Price: ₹{unitPrice}</p>
//                 <p className="text-sm font-medium text-[#FFA00]">Total: ₹{itemTotal}</p>
//               </div>
//               <button onClick={() => handleRemoveItem(index)} className="text-red-500 self-start">
//                 <Trash2 size={18} />
//               </button>
//             </div>

//             <div className="flex justify-center mt-3">
//               <div className="inline-flex items-center gap-3">
//                 <button onClick={() => updateQuantity(index, -1)} className="bg-[#f0d6d6] text-[#660033] rounded-full p-1">
//                   <Minus size={14} />
//                 </button>
//                 <span className="text-sm font-medium">{item.quantity}</span>
//                 <button onClick={() => updateQuantity(index, 1)} className="bg-[#f0d6d6] text-[#660033] rounded-full p-1">
//                   <Plus size={14} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       })}

//       {/* Grand Total for Mobile */}
//       <div className="text-right font-bold text-[#660033] text-lg mt-4">
//         Total: ₹{totalAmount.toFixed(2)}
//       </div>
//     </div>
//   </div>
// )}


//      {cartItems.length > 0 && (
//   <div className="mt-10 flex justify-center">
//     <button
//       onClick={handleConfirmOrder}
//       className="bg-[#660033] text-white px-8 py-3 rounded-full hover:bg-[#880044] transition-all duration-300 shadow-lg hover:scale-105"
//     >
//       ✅ Confirm Order
//     </button>
//   </div>
// )}

//     </div>
//   );
// };

// export default Order;

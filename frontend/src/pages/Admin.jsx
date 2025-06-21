// Admin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-[#660033] mb-6">Welcome Admin Dashboard 🚀</h1>

      <div className="space-y-4">
        <button
          onClick={() => navigate('/qrcode')}
          className="px-6 py-2 bg-[#660033] text-white rounded hover:bg-pink-800 transition"
        >
          QR Code Management
        </button>

        {/* Add more buttons here in future if needed */}
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-10 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-800 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Admin;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import QRCode from 'qrcode';

// const Admin = () => {
//   const navigate = useNavigate();

//   const [prefix, setPrefix] = useState('');
//   const [start, setStart] = useState('');
//   const [count, setCount] = useState('');
//   const [bulkQRCodes, setBulkQRCodes] = useState([]);
//   const [savedQRCodes, setSavedQRCodes] = useState([]);

//   const handleGenerateBulkQR = async () => {
//     if (!prefix || !start || !count) {
//       return alert('Fill all fields: Prefix, Start, and Count');
//     }

//     const qrList = [];
//     for (let i = 0; i < Number(count); i++) {
//       const table = `${prefix}${Number(start) + i}`;
//       const value = `https://zerve.com/table/${table}`;
//       try {
//         const dataUrl = await QRCode.toDataURL(value);
//         qrList.push({ table, image: dataUrl, value });
//       } catch (err) {
//         console.error(`Error generating QR for ${table}`, err);
//       }
//     }
//     setBulkQRCodes(qrList);
//   };

//   const handleSaveToBackend = async (qr) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/save-qr', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ image: qr.image, table: qr.table }),
//       });
//       const data = await response.json();
//       alert(data.message);
//       fetchSavedQRCodes();
//     } catch (err) {
//       alert('Error saving QR to backend');
//       console.error(err);
//     }
//   };

//   const fetchSavedQRCodes = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/get-all-qr');
//       const data = await res.json();
//       setSavedQRCodes(data);
//     } catch (err) {
//       console.error('Error fetching saved QRs', err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/api/delete-qr/${id}`, {
//         method: 'DELETE',
//       });
//       fetchSavedQRCodes();
//     } catch (err) {
//       alert('Error deleting QR');
//     }
//   };

//   useEffect(() => {
//     fetchSavedQRCodes();
//   }, []);

//   return (
//     <div className="p-8 text-center">
//       <h1 className="text-3xl font-bold text-[#660033] mb-6">Welcome Admin Dashboard 🚀</h1>

//       <div className="flex flex-wrap justify-center gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Table Prefix (e.g. A)"
//           value={prefix}
//           onChange={(e) => setPrefix(e.target.value)}
//           className="px-4 py-2 border rounded"
//         />
//         <input
//           type="number"
//           placeholder="Start Number"
//           value={start}
//           onChange={(e) => setStart(e.target.value)}
//           className="px-4 py-2 border rounded"
//         />
//         <input
//           type="number"
//           placeholder="How Many?"
//           value={count}
//           onChange={(e) => setCount(e.target.value)}
//           className="px-4 py-2 border rounded"
//         />
//         <button
//           onClick={handleGenerateBulkQR}
//           className="px-6 py-2 bg-[#660033] text-white rounded hover:bg-pink-800 transition"
//         >
//           Generate All
//         </button>
//       </div>

//       {bulkQRCodes.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {bulkQRCodes.map((qr, idx) => (
//             <div key={idx} className="border p-4 rounded shadow text-center">
//               <h2 className="font-semibold mb-2">{qr.table}</h2>
//               <img src={qr.image} alt={`QR for ${qr.table}`} className="mx-auto w-40 h-40" />
//               <div className="mt-2 space-x-2">
//                 <button
//                   onClick={() => {
//                     const link = document.createElement('a');
//                     link.href = qr.image;
//                     link.download = `${qr.table}-qrcode.png`;
//                     link.click();
//                   }}
//                   className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-800"
//                 >
//                   Download
//                 </button>
//                 <button
//                   onClick={() => handleSaveToBackend(qr)}
//                   className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-800"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {savedQRCodes.length > 0 && (
//         <div className="mt-10">
//           <h2 className="text-xl font-semibold mb-4">Saved QR Codes</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {savedQRCodes.map((qr) => (
//               <div key={qr._id} className="border p-4 rounded text-center">
//                 <h3>{qr.table}</h3>
//                 <img src={qr.image} alt={qr.table} className="w-32 h-32 mx-auto" />
//                 <div className="mt-2 space-x-2">
//                   <button
//                     onClick={() => handleDelete(qr._id)}
//                     className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-800"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <button
//         onClick={() => navigate('/')}
//         className="mt-10 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-800 transition"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default Admin;
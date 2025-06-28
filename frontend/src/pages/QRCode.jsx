import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { FaTable, FaHashtag, FaLayerGroup, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const QRCodeManager = () => {
  const [prefix, setPrefix] = useState('');
  const [start, setStart] = useState('');
  const [count, setCount] = useState('');
  const [bulkQRCodes, setBulkQRCodes] = useState([]);
  const [savedQRCodes, setSavedQRCodes] = useState([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [search, setSearch] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const navigate = useNavigate();
  const isAdmin = userPhone === '6380792434';

  useEffect(() => {
    const phone = localStorage.getItem('phone');
    if (phone) setUserPhone(phone);
  }, []);

  const handleGenerateBulkQR = async () => {
    if (!prefix || !start || !count) {
      return alert('Fill all fields: Prefix, Start, and Count');
    }

    const qrList = [];
    for (let i = 0; i < Number(count); i++) {
      const table = `${prefix}${Number(start) + i}`;
const value = `https://desserttap.netlify.app/menu?table=${table}`;
      try {
        const dataUrl = await QRCode.toDataURL(value);
        qrList.push({ table, image: dataUrl, value });
      } catch (err) {
        console.error(`Error generating QR for ${table}`, err);
      }
    }
    setBulkQRCodes(qrList);
  };

  const handleSaveToBackend = async (qr) => {
    try {
      const res = await fetch('https://dessaer-tap.onrender.com/api/save-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qr),
      });

      const data = await res.json();

      if (res.ok) {
        fetchSavedQRCodes();
      } else {
        alert('❌ Save Failed: ' + data.message);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Error saving QR');
    }
  };

  const handleSaveAll = async () => {
    for (const qr of bulkQRCodes) {
      await handleSaveToBackend(qr);
    }
    alert('✅ All QR codes saved successfully!');
  };

  const fetchSavedQRCodes = async () => {
    try {
      const res = await fetch('https://dessaer-tap.onrender.com/api/get-all-qr');
      const data = await res.json();
      setSavedQRCodes(data);
    } catch (err) {
      console.error('Error fetching saved QRs', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this QR code?');
      if (!confirmDelete) return;

      const res = await fetch(`https://dessaer-tap.onrender.com/api/delete-qr/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchSavedQRCodes();
      } else {
        alert('❌ Failed to delete QR code');
      }
    } catch (err) {
      alert('❌ Error deleting QR');
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'view') {
      fetchSavedQRCodes();
    }
  }, [activeTab]);

  const filteredQRCodes = savedQRCodes.filter((qr) =>
    qr.table.toLowerCase().includes(search.toLowerCase())
  );




return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#880044]">🧾 QR Code Manager</h1>
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center justify-center bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          <FaArrowLeft className="mr-2" /> Back to Admin
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center mb-8 gap-4">
        {['generate', 'view'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full transition ${
              activeTab === tab
                ? 'bg-[#880044] text-white shadow'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab === 'generate' ? '🚀 Generate QR' : '📁 View QR'}
          </button>
        ))}
      </div>

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 mb-6">
            <div className="relative w-72 max-w-full">
              <FaTable className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Table Prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded w-full"
              />
            </div>
            <div className="relative w-72 max-w-full">
              <FaHashtag className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                placeholder="Start Number"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded w-full"
              />
            </div>
            <div className="relative w-72 max-w-full">
              <FaLayerGroup className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                placeholder="How Many?"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerateBulkQR}
                className="px-6 py-2 bg-[#880044] text-white rounded hover:bg-[#aa3366] w-full sm:w-auto"
              >
                Generate All
              </button>

              {bulkQRCodes.length > 0 && (
                <button
                  onClick={handleSaveAll}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 w-full sm:w-auto"
                >
                  💾 Save All
                </button>
              )}
            </div>
          </div>

          {/* Show Generated QR Codes */}
          {bulkQRCodes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {bulkQRCodes.map((qr, idx) => (
                <div key={idx} className="border p-4 rounded shadow text-center">
                  <h2 className="font-semibold text-[#880044] mb-2">{qr.table}</h2>
                  <img src={qr.image} alt={qr.table} className="w-32 h-32 sm:w-40 sm:h-40 mx-auto" />
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = qr.image;
                        link.download = `${qr.table}-qrcode.png`;
                        link.click();
                      }}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-800 w-full sm:w-auto"
                    >
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* View Tab */}
      {activeTab === 'view' && (
        <>
          <div className="mb-4 text-center">
            <input
              type="text"
              placeholder="🔍 Search by Table Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded w-full max-w-xs"
            />
          </div>

          {filteredQRCodes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredQRCodes.map((qr) => (
                <div key={qr._id} className="border p-4 rounded shadow text-center">
                  <h3 className="text-lg font-medium text-[#660033] mb-2">{qr.table}</h3>
                  <img
                    src={`https://dessaer-tap.onrender.com${qr.image}`}
                    alt={qr.table}
                    className="w-32 h-32 sm:w-40 sm:h-40 mx-auto"
                  />
                  <button
                    onClick={() => handleDelete(qr._id)}
                    className="mt-2 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-800 w-full sm:w-auto"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No matching QR codes found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default QRCodeManager;


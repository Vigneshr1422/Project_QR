import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AllQRCodes = () => {
  const [qrList, setQrList] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 👈 loading state

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    fetch('https://dessaer-tap.onrender.com/api/get-all-qr')
      .then(res => res.json())
      .then(data => {
        setQrList(data);
        setIsLoading(false); // ✅ stop loading after data arrives
      })
      .catch(err => {
        console.error('Failed to fetch QR codes:', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="p-6 bg-gradient-to-b from-[#FFF8F2] to-[#ffe9e0] min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#cc3366] drop-shadow">
          Scan it and order it 😋
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Just scan your table’s QR code to start ordering!
        </p>
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <p className="text-center text-gray-500 text-lg">Loading QR codes...</p>
      ) : qrList.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No QR codes saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {qrList.map((qr, index) => (
            <div
              key={qr._id}
              data-aos="fade-right"
              data-aos-delay={index * 100}
              className="text-center"
            >
              <div className="w-40 h-40 mx-auto mb-4 border-4 border-pink-200 rounded-xl overflow-hidden shadow-md">
                <img
                  src={`https://dessaer-tap.onrender.com${qr.image}`}
                  alt={`QR for Table ${qr.table}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="inline-block bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
             {qr.table}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllQRCodes;

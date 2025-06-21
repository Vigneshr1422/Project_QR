import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from './components/Header';
import Home from './pages/home';
import Admin from './pages/Admin';
import QRCodeManager from './pages/QRCode';
import Start from './pages/Start';

function Layout() {
  const location = useLocation();

 useEffect(() => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
  });
}, []);


  // Conditionally show header
  const showHeader = location.pathname !== '/';

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/qrcode" element={<QRCodeManager />} />
      </Routes>
    </>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;

// import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// import Home from './pages/home';
// import Start from './pages/Start';
// import Admin from './pages/Admin';
// import QRCodeManager from './pages/QRCode';

// import Header from './components/Header';

// // Wrapper component to conditionally show Header
// function Layout() {
//   const location = useLocation();
//   const showHeader = location.pathname !== '/'; // hide Header on Start page

//   return (
//     <>
//       {showHeader && <Header />}
//       <Routes>
//         <Route path="/" element={<Start />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/admin" element={<Admin />} />
//         <Route path="/qrcode" element={<QRCodeManager />} />


//       </Routes>
//     </>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Layout />
//     </BrowserRouter>
//   );
// }

// export default App;

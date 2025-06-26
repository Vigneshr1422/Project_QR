import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Order from './pages/Order';
import Header from './components/Header';
import Home from './pages/home';
import Admin from './pages/Admin';
import QRCodeManager from './pages/QRCode';
import Start from './pages/Start';
import MenuPage from './pages/MenuPage';
import { UserContext } from './context/UserContext';
import SuccessPage from './pages/SuccessPage';
import AdminOrders from './pages/AdminOrders'
import About from './pages/About'
function Layout() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const showHeader = location.pathname !== '/';

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/qrcode" element={<QRCodeManager />} />
        <Route path="/menu" element={<MenuPage />} />
        {/* <Route path="/table:tableId" element={<MenuPage />} /> */}
        <Route path="/order" element={<Order />} />
<Route path="/success" element={<SuccessPage />} />
<Route path="/admin-orders" element={<AdminOrders />} />
<Route path="/about" element={<About />} />



      </Routes>
    </>
  );
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        showLogin,
        setShowLogin,
        username,
        setUsername,
        phone,
        setPhone,
      }}
    >
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;

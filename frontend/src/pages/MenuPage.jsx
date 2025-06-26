// ✅ MenuPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import imagePaths from '../assets/imagePaths';
import { FiShoppingCart } from 'react-icons/fi';

const MenuPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('table');

  const [cartItems, setCartItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  useEffect(() => {
    const prevTable = localStorage.getItem('currentTable');

    if (tableId) {
      localStorage.setItem('tableId', tableId);

      if (prevTable !== tableId) {
        localStorage.setItem('currentTable', tableId);
        localStorage.removeItem('cart');
        setCartItems([]);
      } else {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      }
    }

    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    }
  }, [location, tableId]);

  const handleAddToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.name === item.name
    );

    let updatedCart;
    if (existingItemIndex !== -1) {
      updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart = [...cartItems, { ...item, tableId, quantity: 1 }];
    }

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleGoToOrderPage = () => {
    navigate('/order', { state: { tableId } });
  };
  const renderItems = (items) =>
    items.map((item, i) => (
      <div
        key={i}
        className="relative bg-gradient-to-br from-[#fff5f7] to-[#ffe6eb] border border-pink-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 flex flex-col backdrop-blur-md hover:scale-[1.02]"
        data-aos={i % 2 === 0 ? 'fade-right' : 'fade-left'}
        data-aos-delay={i * 100}
      >
        {item.offer && (
          <div className="absolute top-0 left-0 bg-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-xl z-10 shadow">
            {item.offer}
          </div>
        )}

        <div className="bg-white/40 flex items-center justify-center h-60 p-5">
          <img
            src={item.image}
            alt={item.name}
            className="h-full object-contain rounded-xl transition duration-300 hover:scale-105"
          />
        </div>

        <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-bold text-[#4B002D]">{item.name}</h3>
            <p className="text-sm text-gray-700">{item.desc}</p>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-[#333]">{item.price}</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star < Math.round(item.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.21 3.72a1 1 0 00.95.69h3.908c.969 0 1.371 1.24.588 1.81l-3.158 2.292a1 1 0 00-.364 1.118l1.21 3.72c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.158 2.292c-.785.57-1.84-.197-1.54-1.118l1.21-3.72a1 1 0 00-.364-1.118L3.99 9.147c-.783-.57-.38-1.81.588-1.81h3.908a1 1 0 00.95-.69l1.21-3.72z" />
                </svg>
              ))}
              <span className="text-xs text-gray-600 ml-1">({item.rating})</span>
            </div>
          </div>

          <button
            className="w-full mt-3 bg-[#4B002D] text-white text-sm py-2 rounded-lg hover:bg-pink-700 transition-all duration-300"
            onClick={() => handleAddToCart(item)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    ));
  return (
    <div className="bg-white">
      {/* ✅ Show Table Name */}
      {tableId && (
        <div className="text-center text-sm text-gray-600 pt-6 pb-2">
          🍽️ You are ordering for: <span className="font-bold text-pink-600">{tableId}</span>
        </div>
      )}

      {/* ===== Unique Hero Section for Our Menu ===== */}
<section className="relative bg-[#FFEDF1] min-h-screen flex items-center overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between w-full relative z-10">
    
    {/* Image - First on Mobile */}
    <div className="w-full md:w-1/2 flex justify-center" data-aos="zoom-in">
      <img
        src={imagePaths.jigar}
        alt="Jigarthanda"
        className="w-52 sm:w-64 md:w-96 drop-shadow-2xl rounded-2xl rotate-3 transition-all duration-500"
      />
    </div>

    {/* Text Content - Below Image on Mobile */}
    <div
      className="w-full md:w-1/2 text-center md:text-left mt-4 md:mt-0"
      data-aos="fade-right"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#660033] leading-snug sm:leading-tight mb-4">
        Discover Our Signature Menu
      </h1>
      <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
        Savor the timeless taste of Jigarthanda and traditional flavours, reimagined with a twist.
      </p>
      <p className="text-xs sm:text-sm text-gray-500">Home / Menu</p>
    </div>
  </div>
</section>



{/*og da keela*/}
<section className="px-4 sm:px-6 md:px-20 pt-28 pb-16 bg-white" id="jigarthanda-menu">
  <h2
    className="text-3xl sm:text-4xl font-extrabold text-pink-600 mb-10 sm:mb-14 text-center tracking-wide"
    data-aos="zoom-in"
  >
    Famous Jigarthanda Menu
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
    {[
      {
        name: 'Jigarthanda + 1 Scoop Ice Cream',
        price: '₹80',
        rating: 4.5,
        offer: '10% OFF',
        desc: 'Cool Jigarthanda topped with a scoop of vanilla.',
        image: imagePaths.Regular,
      },
      {
        name: 'Jigarthanda + 2 Scoop Ice Cream',
        price: '₹110',
        rating: 4.7,
        offer: '20% OFF',
        desc: 'Double scooped creamy delight on top.',
        image: imagePaths.jumbo,
      },
      {
        name: 'Jigarthanda + Basundi + 1 Scoop',
        price: '₹125',
        rating: 4.9,
        offer: '10% OFF',
        desc: 'Sweet basundi boost with chilled Jigarthanda.',
        image: imagePaths.Special,
      },
      {
        name: 'Jigarthanda + Basundi + 2 Scoop',
        price: '₹140',
        rating: 5.0,
        offer: '20% OFF',
        desc: 'Cream overload in a jumbo treat.',
        image: imagePaths.delight,
      },
      {
        name: 'Nuts Jigarthanda',
        price: '₹135',
        rating: 4.8,
        offer: 'Free Nuts',
        desc: 'Topped with nuts, basundi & ice cream.',
        image: imagePaths.nuts,
      },
      {
        name: 'Dry Fruits Jigarthanda',
        price: '₹145',
        rating: 4.9,
        offer: '',
        desc: 'Basundi & dry fruits blended with cool Jigarthanda.',
        image: imagePaths.dry,
      },
    ].map((item, i) => (
      <div
        key={i}
        className="relative bg-gradient-to-br from-[#fff5f7] to-[#ffe6eb] border border-pink-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 flex flex-col hover:scale-[1.02]"
        data-aos={i % 2 === 0 ? 'fade-right' : 'fade-left'}
        data-aos-delay={i * 100}
      >
        {/* Ribbon Tag */}
        {item.offer && (
          <div className="absolute top-0 left-0 bg-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-xl z-10 shadow">
            {item.offer}
          </div>
        )}

        {/* Image */}
        <div className="bg-white/40 flex items-center justify-center h-48 sm:h-60 p-4 sm:p-5">
          <img
            src={item.image}
            alt={item.name}
            className="h-full object-contain rounded-xl transition duration-300 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#4B002D]">{item.name}</h3>
            <p className="text-sm text-gray-700">{item.desc}</p>
          </div>

          {/* Price + Rating */}
          <div className="flex justify-between items-center text-sm flex-wrap gap-y-2">
            <div className="flex items-center">
              <span className="font-semibold text-[#333]">{item.price}</span>
              {/* Show quantity if in cart */}
              {(() => {
                const cartItem = cartItems.find(ci => ci.name === item.name);
                return cartItem ? (
                  <span className="text-xs text-pink-600 font-semibold ml-2">
                    × {cartItem.quantity}
                  </span>
                ) : null;
              })()}
            </div>

            <div className="flex items-center gap-[2px]">
              {[...Array(5)].map((_, star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star < Math.round(item.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.21 3.72a1 1 0 00.95.69h3.908c.969 0 1.371 1.24.588 1.81l-3.158 2.292a1 1 0 00-.364 1.118l1.21 3.72c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.158 2.292c-.785.57-1.84-.197-1.54-1.118l1.21-3.72a1 1 0 00-.364-1.118L3.99 9.147c-.783-.57-.38-1.81.588-1.81h3.908a1 1 0 00.95-.69l1.21-3.72z" />
                </svg>
              ))}
              <span className="text-xs text-gray-600 ml-1">({item.rating})</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => {
              setSelectedItem(item);
              setQuantity(1);
              setShowQuantityModal(true);
            }}
            className="bg-[#4B002D] text-white px-5 py-2 rounded-full hover:bg-pink-700 transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    ))}
  </div>
</section>


<div className="my-20" /> 
<section className="px-4 sm:px-6 md:px-20 pt-28 pb-20 bg-white" id="falooda-menu">
  <h2
    className="text-3xl sm:text-4xl font-extrabold text-pink-600 mb-10 sm:mb-14 text-center tracking-wide"
    data-aos="fade-up"
  >
    Famous Falooda Menu
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
    {[
      {
        name: 'Falooda Vanilla +2',
        desc: 'Fresh Milk + Jelly + Falooda sev + Sabja seeds + Nuts + Vanilla Syrup',
        price: '₹120',
        offer: '10% OFF',
        rating: 4.6,
        image: imagePaths.vanila,
      },
      {
        name: 'Falooda Chocolate +2',
        desc: 'Fresh Milk + Jelly + Falooda sev + Sabja seeds + Nuts + Chocolate Syrup',
        price: '₹130',
        offer: '15% OFF',
        rating: 4.8,
        image: imagePaths.chaco,
      },
      {
        name: 'Rainbow Falooda +7',
        desc: 'Fresh Thick Milk + Falooda Sev + Jelly + Rose Syrup',
        price: '₹150',
        offer: 'Colorful Special',
        rating: 4.9,
        image: imagePaths.rainboww,
      },
      {
        name: 'Kulfi Falooda',
        desc: 'Thick milk Falooda with rich Kulfi and toppings.',
        price: '₹140',
        offer: '',
        rating: 4.7,
        image: imagePaths.kulfiee,
      },
      {
        name: 'Dry Fruit Falooda',
        desc: 'Loaded with dry fruits + falooda sev + sabja + jelly.',
        price: '₹145',
        offer: 'Dry Fruit Delight',
        rating: 4.8,
        image: imagePaths.dryy,
      },
      {
        name: 'Rose Falooda',
        desc: 'Classic rose syrup with milk, jelly, sabja & nuts.',
        price: '₹110',
        offer: '',
        rating: 4.5,
        image: imagePaths.rose,
      },
    ].map((item, i) => (
      <div
        key={i}
        className="relative bg-gradient-to-br from-[#fff6f9] to-[#ffe6ed] border border-pink-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col hover:scale-[1.02]"
        data-aos={i % 3 === 0 ? 'flip-left' : i % 3 === 1 ? 'zoom-in' : 'fade-up'}
        data-aos-delay={i * 100}
      >
        {/* Ribbon Tag */}
        {item.offer && (
          <div className="absolute top-0 left-0 bg-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-xl z-10 shadow">
            {item.offer}
          </div>
        )}

        {/* Image */}
        <div className="bg-white/40 flex items-center justify-center h-48 sm:h-60 p-4 sm:p-5">
          <img
            src={item.image}
            alt={item.name}
            className="h-full object-contain rounded-xl transition duration-300 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#4B002D]">{item.name}</h3>
            <p className="text-sm text-gray-700">{item.desc}</p>
          </div>

          {/* Price + Rating */}
          <div className="flex justify-between items-center text-sm flex-wrap gap-y-2">
            <div className="flex items-center">
              <span className="font-semibold text-[#333]">{item.price}</span>
              {(() => {
                const cartItem = cartItems.find(ci => ci.name === item.name);
                return cartItem ? (
                  <span className="text-xs text-pink-600 font-semibold ml-2">
                    × {cartItem.quantity}
                  </span>
                ) : null;
              })()}
            </div>

            <div className="flex items-center gap-[2px]">
              {[...Array(5)].map((_, star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star < Math.round(item.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.21 3.72a1 1 0 00.95.69h3.908c.969 0 1.371 1.24.588 1.81l-3.158 2.292a1 1 0 00-.364 1.118l1.21 3.72c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.158 2.292c-.785.57-1.84-.197-1.54-1.118l1.21-3.72a1 1 0 00-.364-1.118L3.99 9.147c-.783-.57-.38-1.81.588-1.81h3.908a1 1 0 00.95-.69l1.21-3.72z" />
                </svg>
              ))}
              <span className="text-xs text-gray-600 ml-1">({item.rating})</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => {
              setSelectedItem(item);
              setQuantity(1);
              setShowQuantityModal(true);
            }}
            className="bg-[#4B002D] text-white px-5 py-2 rounded-full hover:bg-pink-700 transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    ))}
  </div>
</section>


<div className="my-20" />
<section className="px-4 sm:px-6 md:px-20 pt-28 pb-20 bg-white" id="icecream-menu">
  <h2
    className="text-3xl sm:text-4xl font-extrabold text-pink-600 mb-10 sm:mb-14 text-center tracking-wide"
    data-aos="fade-up"
  >
    Famous Ice Cream Menu
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
    {[
      {
        name: 'Strawberry',
        desc: 'Fresh Milk + Strawberry Ice Cream. Scoop of Famous Strawberry Flavour Ice Cream available at our outlet.',
        price: '₹80',
        offer: '10% OFF',
        rating: 4.6,
        image: imagePaths.Strawberry,
      },
      {
        name: 'Black Currant',
        desc: 'Fresh Milk + Black Currant Ice Cream. Scoop of the rich fruity flavor at Madurai Famous Jigarthanda.',
        price: '₹90',
        offer: '',
        rating: 4.8,
        image: imagePaths.BlackCurrant,
      },
      {
        name: 'Chocolate',
        desc: 'Fresh Milk + Chocolate Ice Cream. Scoop of Famous Chocolate Flavour Ice Cream available at the outlet.',
        price: '₹95',
        offer: 'Kids Favorite',
        rating: 4.9,
        image: imagePaths.Chocolate,
      },
      {
        name: 'Pista',
        desc: 'Fresh Milk + Pista Flavor Ice Cream. Nutty delight from Madurai Famous Jigarthanda.',
        price: '₹100',
        offer: '10% OFF',
        rating: 4.6,
        image: imagePaths.Pista,
      },
      {
        name: 'Mango',
        desc: 'Fresh Milk + Mango Ice Cream. A fruity chilled scoop from the tropical sweetness of mango.',
        price: '₹105',
        offer: 'Mango Magic',
        rating: 4.7,
        image: imagePaths.mongoo,
      },
      {
        name: 'Famous Malai-Cream',
        desc: 'Fresh Malai Tasty Ice Cream. Rich and creamy scoop full of tradition.',
        price: '₹110',
        offer: '',
        rating: 4.8,
        image: imagePaths.malai,
      },
    ].map((item, i) => (
      <div
        key={i}
        className="relative bg-gradient-to-br from-[#fff6f9] to-[#fff0f0] border border-pink-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col hover:scale-[1.02]"
        data-aos={i % 3 === 0 ? 'fade-left' : i % 3 === 1 ? 'zoom-in-up' : 'flip-up'}
        data-aos-delay={i * 100}
      >
        {/* Offer Ribbon */}
        {item.offer && (
          <div className="absolute top-0 left-0 bg-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-xl z-10 shadow-md">
            {item.offer}
          </div>
        )}

        {/* Image */}
        <div className="bg-white/40 flex items-center justify-center h-48 sm:h-60 p-4 sm:p-5">
          <img
            src={item.image}
            alt={item.name}
            className="h-full object-contain rounded-xl transition duration-300 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#4B002D]">{item.name}</h3>
            <p className="text-sm text-gray-700">{item.desc}</p>
          </div>

          {/* Price + Rating */}
          <div className="flex justify-between items-center text-sm flex-wrap gap-y-2">
            <div className="flex items-center">
              <span className="font-semibold text-[#333]">{item.price}</span>
              {(() => {
                const cartItem = cartItems.find(ci => ci.name === item.name);
                return cartItem ? (
                  <span className="text-xs text-pink-600 font-semibold ml-2">
                    × {cartItem.quantity}
                  </span>
                ) : null;
              })()}
            </div>

            <div className="flex items-center gap-[2px]">
              {[...Array(5)].map((_, star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star < Math.round(item.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.21 3.72a1 1 0 00.95.69h3.908c.969 0 1.371 1.24.588 1.81l-3.158 2.292a1 1 0 00-.364 1.118l1.21 3.72c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.158 2.292c-.785.57-1.84-.197-1.54-1.118l1.21-3.72a1 1 0 00-.364-1.118L3.99 9.147c-.783-.57-.38-1.81.588-1.81h3.908a1 1 0 00.95-.69l1.21-3.72z" />
                </svg>
              ))}
              <span className="text-xs text-gray-600 ml-1">({item.rating})</span>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => {
              setSelectedItem(item);
              setQuantity(1);
              setShowQuantityModal(true);
            }}
            className="bg-[#4B002D] text-white px-5 py-2 rounded-full hover:bg-pink-700 transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    ))}
  </div>
</section>



{/* Floating Order Now Button */}
{cartItems.length > 0 && (
  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-auto flex justify-center">
    <button
      onClick={handleGoToOrderPage}
      className="w-full sm:w-auto bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-base font-semibold hover:bg-pink-700 transition-all duration-300 hover:scale-[1.03]"
    >
      <FiShoppingCart className="text-xl" />
      <span>Order Now ({cartItems.length})</span>
    </button>
  </div>
)}

{/* Quantity Modal */}
{showQuantityModal && selectedItem && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-xl space-y-5 animate-fadeIn">
      <h2 className="text-lg font-bold text-center text-[#4B002D] leading-snug">
        How many <span className="text-pink-600">{selectedItem.name}</span>?
      </h2>

      {/* Quantity Controls */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-2xl"
        >
          –
        </button>
        <span className="text-2xl font-semibold">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-2xl"
        >
          +
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 pt-1 flex-wrap">
        <button
          onClick={() => {
            const existingItemIndex = cartItems.findIndex(
              (cartItem) => cartItem.name === selectedItem.name
            );
            let updatedCart;
            if (existingItemIndex !== -1) {
              updatedCart = [...cartItems];
              updatedCart[existingItemIndex].quantity += quantity;
            } else {
              updatedCart = [
                ...cartItems,
                { ...selectedItem, tableId, quantity },
              ];
            }

            setCartItems(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            setShowQuantityModal(false);
            setSelectedItem(null);
          }}
          className="bg-[#4B002D] text-white px-5 py-2 rounded-full hover:bg-pink-700 transition"
        >
          Add {quantity} to Cart
        </button>

        <button
          onClick={() => {
            setShowQuantityModal(false);
            setSelectedItem(null);
          }}
          className="text-gray-600 hover:text-pink-600 transition text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}





    </div>
  );
};

export default MenuPage;

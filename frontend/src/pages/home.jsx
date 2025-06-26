import { useRef } from 'react';

import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {  IceCream, Snowflake, Heart } from 'lucide-react';

import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imagePaths from '../assets/imagePaths';
import { FaArrowRight ,FaArrowDown,FaArrowLeft} from 'react-icons/fa'; // import arrow icon
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const services = [
  {
    title: 'Faluda',
    subtitle: 'Creamy layers crunchy bites.',
    discount: 'Only ₹99',
    image: imagePaths.vanila,
    scrollId: 'falooda-menu',
  },
  {
    title: 'Jigarthanda',
    subtitle: 'Chill down with our OG dessert drink.',
    discount: 'Upto 60% OFF',
    image: imagePaths.jigar,
    scrollId: 'jigarthanda-menu',
  },
  {
    title: 'Ice Cream',
    subtitle: 'Scoops of Joy in Every Bite!',
    discount: 'Flat ₹30 OFF',
    image: imagePaths.iceee,
    scrollId: 'icecream-menu',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
const testimonialRef = useRef(null);

useEffect(() => {
  AOS.init({ duration: 1000, once: true });

  const observer = new IntersectionObserver(
    async (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        try {
          const res = await  fetch('https://order-qr.onrender.com/api/contact/testimonials'); {/*fetch('https://order-qr.onrender.com/api/contact/testimonials');*/}
          const data = await res.json();
          setTestimonials(data);
        } catch (err) {
          console.error('Error fetching testimonials:', err);
        }
        observer.disconnect(); // only call once
      }
    },
    { threshold: 0.2 }
  );

  if (testimonialRef.current) {
    observer.observe(testimonialRef.current);
  }

  return () => observer.disconnect(); // cleanup
}, []);


  const handleCardClick = (scrollId) => {
    navigate('/menu', { state: { scrollTo: scrollId } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    {/*
      const res = await fetch('https://order-qr.onrender.com/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});


      */}
    try {
  //   const res = await fetch('http://localhost:5000/api/contact', {
  // method: 'POST',
  // headers: { 'Content-Type': 'application/json' },
  // body: JSON.stringify(data),
     const res = await fetch('https://order-qr.onrender.com/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

     if (res.ok) {
toast('❤️', {
  icon: false,
  position: 'bottom-center',
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  style: {
    background: 'transparent',
    boxShadow: 'none',
    fontSize: '2rem',
    textAlign: 'center',
  },
  bodyStyle: {
    margin: 0,
    padding: 0,
  }
});

  e.target.reset();
  document.getElementById('testimonial').scrollIntoView({ behavior: 'smooth' });
  setTestimonials((prev) => [
    {
      name: data.name,
      message: data.message,
      address: data.address || 'Happy Customer',
    },
    ...prev,
  ]);
}
 else {
        alert('Something went wrong!');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const itemsPerPage = 6;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const paginatedTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const filteredServices = services.filter((service) =>
    (service.title || '').toLowerCase().includes(searchTerm)
  );

  return (
    <>
      {/* Curve Top Section */}
      <div className="relative w-full">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 z-10">
          <svg
            className="block w-[150%] sm:w-[120%] md:w-full h-[60px] sm:h-[80px] md:h-[100px]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path
              d="M321.39 56.39C202.4 88.4 86.1 112.29 0 96V0h1200v96c-100.5 14.92-210.09 2.17-321.39-22.61C764.58 46.09 643.86 78.54 502.31 95.65 403.39 107.25 301.43 99.6 201.94 80.24c-64.9-12.49-132.5-30.61-201.94-51.07z"
              className="fill-orange-500"
            />
          </svg>
        </div>
      </div>

      {/* Hero & Services Section */}
  <div className="bg-orange-500 min-h-[100vh] pt-32 pb-12 px-4 flex flex-col items-center overflow-x-hidden relative z-0" data-aos="fade-up">
  <h2 className="text-4xl font-bold text-white text-center mb-6">
    Craving Something Cool? <br /> Discover Dessert Tap Delights!
  </h2>

  <input
    type="text"
    placeholder=" 🔎 Search your favorite desserts..."
    className="w-full max-w-md px-5 py-3 rounded-xl shadow-lg outline-none mb-10"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
  />

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
    {filteredServices.map((service, index) => (
      <div
        key={index}
        onClick={() => handleCardClick(service.scrollId)}
        className="bg-white rounded-3xl shadow-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-row justify-between items-center"
        data-aos="zoom-in"
        data-aos-delay={index * 100}
      >
        <div className="flex-1 pr-6">
          <h3 className="text-2xl font-bold text-gray-800">{service.title}</h3>
          <p className="text-gray-600 text-base">{service.subtitle}</p>
          <div className="bg-orange-100 text-orange-500 w-fit px-4 py-1 mt-4 rounded-full text-sm font-semibold">
            {service.discount}
          </div>
          <button
            className="mt-5 bg-orange-500 p-3 rounded-full shadow"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(service.scrollId);
            }}
          >
            <ArrowRight className="text-white w-5 h-5" />
          </button>
        </div>
        <img src={service.image} alt={service.title} className="w-32 h-32 object-contain" />
      </div>
    ))}
  </div>
</div>




<section className="bg-[#FFF8F2] py-12 px-4 sm:px-6 md:px-12" data-aos="fade-up">
  <h2 className="text-3xl sm:text-4xl font-bold text-center text-pink-700 mb-14">
    How Zerve Works 🍽️
  </h2>

  {/* Top Row → → → */}
  <div className="flex flex-col items-center">
    <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-10" data-aos="fade-right">
      {/* Step 1 */}
      <div className="flex flex-col items-center text-center">
        <img src={imagePaths.qrcode} alt="Scan QR" className="w-32 h-32 sm:w-36 sm:h-36 mb-3 drop-shadow-lg hover:scale-105 transition-transform duration-300" />
        <p className="text-base font-semibold">Scan QR</p>
        <p className="text-sm text-gray-500">Placed on the table</p>
      </div>

      <FaArrowRight className="text-pink-600 text-3xl hidden md:block" />

      {/* Step 2 */}
      <div className="flex flex-col items-center text-center">
        <img src={imagePaths.menu} alt="Menu" className="w-32 h-32 sm:w-36 sm:h-36 mb-3 drop-shadow-lg hover:scale-105 transition-transform duration-300" />
        <p className="text-base font-semibold">View Menu</p>
        <p className="text-sm text-gray-500">Redirect to Menu Page</p>
      </div>

      <FaArrowRight className="text-pink-600 text-3xl hidden md:block" />

      {/* Step 3 */}
      <div className="flex flex-col items-center text-center">
        <img src={imagePaths.orderf} alt="Order" className="w-32 h-32 sm:w-36 sm:h-36 mb-3 drop-shadow-lg hover:scale-105 transition-transform duration-300" />
        <p className="text-base font-semibold">Place Order</p>
        <p className="text-sm text-gray-500">Add items to cart</p>
      </div>
    </div>

    {/* Down Arrow to Bottom Row */}
    <div className="my-6">
      <FaArrowDown className="text-pink-600 text-3xl" />
    </div>

    {/* Bottom Row ← ← ← */}
    <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-10 flex-row-reverse" data-aos="fade-left">
      {/* Step 4 */}
      <div className="flex flex-col items-center text-center">
        <img src={imagePaths.otp} alt="OTP" className="w-32 h-32 sm:w-36 sm:h-36 mb-3 drop-shadow-lg hover:scale-105 transition-transform duration-300" />
        <p className="text-base font-semibold">Login via OTP</p>
        <p className="text-sm text-gray-500">Mobile verification</p>
      </div>

      <FaArrowLeft className="text-pink-600 text-3xl hidden md:block" />

      {/* Step 5 */}
      <div className="flex flex-col items-center text-center">
        <img src={imagePaths.razer} alt="Payment" className="w-32 h-32 sm:w-36 sm:h-36 mb-3 drop-shadow-lg hover:scale-105 transition-transform duration-300" />
        <p className="text-base font-semibold">Pay with Razorpay</p>
        <p className="text-sm text-gray-500">Complete payment</p>
      </div>

      <FaArrowLeft className="text-pink-600 text-3xl hidden md:block" />

      {/* Step 6 */}
      <div className="flex flex-col items-center text-center">
        <img src={imagePaths.finish} alt="Order Placed" className="w-32 h-32 sm:w-36 sm:h-36 mb-3 drop-shadow-lg hover:scale-105 transition-transform duration-300" />
        <p className="text-base font-semibold">Order Placed</p>
        <p className="text-sm text-gray-500">Restaurant notified</p>
      </div>
    </div>
  </div>
</section>



      {/* ✨ Our Menu Section – MISSING DIV FIXED HERE */}
    <div className="bg-orange-50 py-12 sm:py-16 px-4 sm:px-6 text-center" data-aos="fade-up">
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-4 leading-snug">
    Explore Our Menu
  </h2>
  <p className="text-gray-600 text-sm sm:text-base max-w-md sm:max-w-xl mx-auto mb-10">
    Scoop, sip, and savor the coolest combos in town — curated with love by Dessert Tap!
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
    {[
      {
        title: 'Falooda Delights',
        desc: 'A fusion of flavors — silky vermicelli, ice cream, and fruity charm in every cup.',
        icon: imagePaths.faluda,
      },
      {
        title: 'Jigarthanda Magic',
        desc: 'Chill with the authentic taste of Madurai’s iconic creamy, herbal dessert.',
        icon: imagePaths.jigar,
      },
      {
        title: 'Chill Beverages',
        desc: 'From mocktails to milkshakes, our drinks are made to refresh and recharge.',
        icon: imagePaths.juice,
      },
    ].map((item, idx) => (
      <div
        key={idx}
        data-aos="fade-up"
        data-aos-delay={idx * 100}
        className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
      >
        <img src={item.icon} alt={item.title} className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-4" />
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-orange-500 mb-2">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
      </div>
    ))}
  </div>
</div>


      {/* ✅ The rest of the sections like What's waiting, Testimonials, Contact, etc. continue as in your original file */}
      {/* Just make sure every `div` or `section` you open is properly closed before the final `</>` */}
      
      {/* What's waiting for you section */}
     <div className="relative w-full bg-white px-4 text-center" data-aos="fade-up">
  <div className="pt-16 sm:pt-20">
    <h2 className="text-2xl sm:text-4xl font-bold text-pink-600 mb-4 leading-snug">
      What’s waiting for you <br className="sm:hidden" /> on the app?
    </h2>
    <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mb-10">
      Our app is packed with features that enable you to experience food delivery like never before
    </p>
  </div>

  <div className="flex flex-col lg:flex-row justify-center items-center gap-10 max-w-6xl mx-auto">
    {/* Left Column */}
    <div className="flex flex-col gap-4 sm:gap-6">
      {[
        { title: 'Healthy', icon: imagePaths.foodpic },
        { title: 'Veg Mode', icon: imagePaths.veg },
        { title: 'Plan a Party', icon: imagePaths.party }
      ].map((item, idx) => (
        <div
          key={idx}
          className="w-36 sm:w-40 h-36 sm:h-40 bg-white shadow-md rounded-xl flex flex-col items-center justify-center p-3 hover:scale-105 transition"
          data-aos="fade-right"
          data-aos-delay={idx * 100}
        >
          <img src={item.icon} alt={item.title} className="w-12 h-12 object-contain mb-2" />
          <p className="text-sm sm:text-base text-gray-800 font-semibold">{item.title}</p>
        </div>
      ))}
    </div>

    {/* Center Image */}
    <div className="w-full max-w-xs sm:max-w-md lg:w-[600px] h-auto flex justify-center items-center">
      <img
        src={imagePaths.design}
        alt="Food on Train"
        className="w-full h-auto object-contain"
        data-aos="zoom-in"
      />
    </div>

    {/* Right Column */}
    <div className="flex flex-col gap-4 sm:gap-6">
      {[
        { title: 'Gourmet', icon: imagePaths.gourmet },
        { title: 'Offers', icon: imagePaths.offer },
        { title: 'Collections', icon: imagePaths.collections }
      ].map((item, idx) => (
        <div
          key={idx}
          className="w-36 sm:w-40 h-36 sm:h-40 bg-white shadow-md rounded-xl flex flex-col items-center justify-center p-3 hover:scale-105 transition"
          data-aos="fade-left"
          data-aos-delay={idx * 100}
        >
          <img src={item.icon} alt={item.title} className="w-12 h-12 object-contain mb-2" />
          <p className="text-sm sm:text-base text-gray-800 font-semibold">{item.title}</p>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* Pink Thread Divider at Bottom */}
<div className="w-full">
  <svg
    className="w-full h-20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
  >
    <path
      d="M0,80 C240,140 480,20 720,80 C960,140 1200,40 1440,100"
      stroke="#fcb6c1"
      strokeWidth="6"
      strokeDasharray="6 8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>



{/* Signature Products Feature Section */}
<div className="relative bg-white w-full overflow-hidden" data-aos="fade-up">
  <div className="relative z-10 px-4 sm:px-6 py-16 sm:py-20 max-w-6xl mx-auto text-center">
    <h2 className="text-2xl sm:text-4xl font-bold text-pink-600 mb-3 sm:mb-4 leading-snug">
      Why Everyone Loves <br className="sm:hidden" /> Dessert Tap’s Signature Sips 🍧
    </h2>
    <p className="text-gray-600 text-sm sm:text-lg mb-10 sm:mb-16 max-w-xl mx-auto">
      From creamy scoops to chilled classics – Dessert Tap delivers finest indulgence!
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
      {[
        {
          title: "Iconic Jigarthanda",
          desc: "A true Madurai favorite, made with authentic basundi, sarsaparilla syrup, and our secret ice blend for ultimate chill!",
          icon: <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-pink-500" />,
        },
        {
          title: "Falooda Fantasy",
          desc: "Layered with silky vermicelli, basil seeds, and rich kulfi ice cream – every sip is a celebration of texture & taste!",
          icon: <IceCream className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500" />,
        },
        {
          title: "Premium Ice Creams",
          desc: "From classic vanilla to exotic rose – our scoops are made fresh, creamy, and full of flavor. No shortcuts!",
          icon: <Snowflake className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" />,
        },
        {
          title: "Fresh, Local Ingredients",
          desc: "We use high-quality milk, seasonal fruits, and zero preservatives to keep every product delicious and wholesome.",
          icon: <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />,
        },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-white shadow-md sm:shadow-lg rounded-xl sm:rounded-2xl px-4 py-5 sm:p-6 text-left flex items-start gap-4 sm:gap-6 hover:shadow-xl transition"
          data-aos="fade-up"
          data-aos-delay={index * 100}
        >
          <div>{item.icon}</div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-pink-600 mb-1 sm:mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-2">{item.desc}</p>
            <button className="text-orange-500 font-medium text-sm underline hover:text-orange-600 transition">
              Explore
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>


   

  {/* Our Testimonial Section */}
<section
  id="testimonial"
    ref={testimonialRef}
  className="bg-white py-16 sm:py-20 px-4 text-center"
  data-aos="fade-up"
>
  <h2 className="text-2xl sm:text-4xl font-bold text-pink-600 mb-3 sm:mb-4 leading-snug">
    What Our Customers Say
  </h2>
  <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-10 sm:mb-12">
    Real experiences from our happy customers!
  </p>

  {testimonials.length === 0 ? (
    <p className="text-gray-500">No testimonials yet.</p>
  ) : (
    <div className="relative max-w-6xl mx-auto">
      {/* Testimonials grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 transition-all duration-500">
        {paginatedTestimonials.map((item, idx) => (
          <div
            key={idx}
            className="relative bg-white border border-[#f2dfe6] rounded-2xl p-5 sm:p-6 shadow-lg transition hover:scale-[1.03] duration-300 group"
          >
            <div className="absolute -top-4 sm:-top-5 left-4 sm:left-5 bg-pink-100 text-white text-lg sm:text-xl w-9 sm:w-10 h-9 sm:h-10 flex items-center justify-center rounded-full shadow-lg group-hover:rotate-12 transition duration-300">
              💬
            </div>
            <p className="text-gray-700 text-sm sm:text-base italic mb-4 mt-6 leading-relaxed">
              “{item.message}”
            </p>
            <div className="border-t pt-3 mt-4">
              <h4 className="font-bold text-base sm:text-lg text-pink-400">{item.name}</h4>
              <span className="text-xs sm:text-sm text-gray-500">
                {item.address || 'Happy Customer'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dot navigation */}
      {testimonials.length > itemsPerPage && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                currentPage === idx ? 'bg-[#660033] scale-110' : 'bg-gray-300'
              }`}
            ></button>
          ))}
        </div>
      )}
    </div>
  )}
</section>


{/* Pink Thread Divider */}
<div className="w-full">
  <svg
    className="w-full h-20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
  >
    <path
      d="M0,80 C240,140 480,20 720,80 C960,140 1200,40 1440,100"
      stroke="#fcb6c1"
      strokeWidth="6"
      strokeDasharray="6 8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>

{/* Contact Section */}
{/* Pink thread before Contact Section */}

{/* Contact Section */}
<section className="bg-white py-16 sm:py-20 px-4" data-aos="fade-up">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
    
    {/* Map Section */}
    <div className="w-full" data-aos="fade-right">
      <h3 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4 text-center md:text-left">
        📍 Our Location
      </h3>
      <div className="w-full h-64 sm:h-80">
        <iframe
          src="https://www.google.com/maps/embed?pb=..."
          className="w-full h-full rounded-xl border"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>

    {/* Contact Form */}
    <div className="w-full md:pl-6" data-aos="fade-left">
      <h3 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4 text-center md:text-left">
        📬 Get in Touch
      </h3>
      <form
        className="bg-white border border-pink-300 p-5 sm:p-6 rounded-xl shadow space-y-4"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="w-full p-3 border border-pink-200 rounded focus:outline-pink-400 text-sm"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-3 border border-pink-200 rounded focus:outline-pink-400 text-sm"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          className="w-full p-3 border border-pink-200 rounded focus:outline-pink-400 text-sm"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="w-full p-3 border border-pink-200 rounded focus:outline-pink-400 text-sm"
        />
        <textarea
          name="message"
          placeholder="Message"
          required
          rows="4"
          className="w-full p-3 border border-pink-200 rounded focus:outline-pink-400 text-sm"
        ></textarea>
    <button
  type="submit"
  className="w-full bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 active:scale-95 transition duration-300 shadow-md"
>
  Send
</button>

      </form>

    </div>

  </div>
</section>
      <ToastContainer />

    </>
  );
};

export default Home;

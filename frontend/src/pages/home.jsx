import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Landmark, HeartPulse, Clock, Sparkles } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Faluda',
    subtitle: 'Cool & Sweet Delights',
    discount: 'Only ₹99',
    image: '/public/images/faludaa.png',
  },
  {
    title: 'Food',
    subtitle: 'Tasty Main Courses',
    discount: 'Upto 60% OFF',
    image: '/public/images/foodd.jpg',
  },
  {
    title: 'Drinks',
    subtitle: 'Fresh Beverages',
    discount: 'Flat ₹30 OFF',
    image: '/public/images/juice.png',
  },
];

const Home = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchTestimonials = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/contact/testimonials');
        const data = await res.json();
        setTestimonials(data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      }
    };

    fetchTestimonials();
  }, []);

  const handleCardClick = (title) => {
    console.log(`Clicked: ${title}`);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert('Message sent!');
      e.target.reset(); // 💖 This line clears the form
      document.getElementById('testimonial').scrollIntoView({ behavior: 'smooth' });
      setTestimonials(prev => [
        {
          name: data.name,
          message: data.message,
          address: data.address || 'Happy Customer'
        },
        ...prev
      ]);
    } else {
      alert('Something went wrong!');
    }
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
};


const [currentPage, setCurrentPage] = useState(0);
const itemsPerPage = 6;

const totalPages = Math.ceil(testimonials.length / itemsPerPage);

const paginatedTestimonials = testimonials.slice(
  currentPage * itemsPerPage,
  (currentPage + 1) * itemsPerPage
);


  return (
    <>
      {/* Curve Top Section */}
      <div className="relative w-full">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180 z-10">
          <svg
            className="relative block w-[calc(150%+1.3px)] h-[100px]"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path
              d="M321.39 56.39C202.4 88.4 86.1 112.29 0 96V0h1200v96c-100.5 14.92-210.09 2.17-321.39-22.61C764.58 46.09 643.86 78.54 502.31 95.65 403.39 107.25 301.43 99.6 201.94 80.24c-64.9-12.49-132.5-30.61-201.94-51.07z"
              className="fill-orange-500"
            ></path>
          </svg>
        </div>
      </div>

      {/* Main Section */}
      <div className="bg-orange-500 min-h-[100vh] pt-32 pb-12 px-4 flex flex-col items-center overflow-x-hidden relative z-0" data-aos="fade-up">
        <h2 className="text-4xl font-bold text-white text-center mb-6">
          Order food & Drinks. <br /> Discover best Items
        </h2>

        <input
          type="text"
          placeholder=" 🔎Search your favorite items..."
          className="w-full max-w-md px-5 py-3 rounded-xl shadow-lg outline-none mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(service.title)}
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
                <button className="mt-5 bg-orange-500 p-3 rounded-full shadow">
                  <ArrowRight className="text-white w-5 h-5" />
                </button>
              </div>
              <img
                src={service.image}
                alt={service.title}
                className="w-32 h-32 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

         {/* Our Menu Section */}
      <div className="bg-orange-50 py-20 px-4 text-center" data-aos="fade-up">
        <h2 className="text-4xl font-bold text-orange-500 mb-4">
          Explore Our Menu
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-12">
          From refreshing drinks to mouth-watering delights — we have everything your taste buds crave!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: 'Faluda Specials',
              desc: 'Delicious creamy faluda with a variety of flavors.',
              icon: '/public/images/faludaa.png',
            },
            {
              title: 'Main Course',
              desc: 'From biryanis to burgers – feast time!',
              icon: '/public/images/foodd.jpg',
            },
            {
              title: 'Cool Drinks',
              desc: 'Refreshing juices & mocktails to chill your soul.',
              icon: '/public/images/juice.png',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition"
              data-aos-delay={idx * 100}
            >
              <img src={item.icon} alt={item.title} className="w-20 h-20 object-contain mb-4" />
              <h3 className="text-xl font-bold text-orange-500 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-3">{item.desc}</p>
              <button className="text-pink-600 underline font-semibold">View Items</button>
            </div>
          ))}
        </div>
      </div>

      {/* What's waiting for you section */}
      <div className="relative w-full bg-white px-4 text-center pb-0" data-aos="fade-up">
        <div className="pt-20">
          <h2 className="text-4xl font-bold text-pink-600 mb-4">
            What’s waiting for you <br className="sm:hidden" /> on the app?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-12">
            Our app is packed with features that enable you to experience food delivery like never before
          </p>
        </div>

<div className="flex flex-col md:flex-row justify-center items-start gap-12 max-w-6xl mx-auto pb-1">
          <div className="flex flex-col gap-6">
            {[{ title: 'Healthy', icon: '/public/images/foodpic.png' }, { title: 'Veg Mode', icon: '/public/images/veg.png' }, { title: 'Plan a Party', icon: '/public/images/party.png' }].map((item, idx) => (
              <div
                key={idx}
                className="w-[160px] h-[150px] bg-white shadow-md rounded-xl flex flex-col items-center justify-center p-4 hover:scale-105 transition"
                data-aos="fade-right"
                data-aos-delay={idx * 100}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-16 h-16 object-contain mb-3"
                />
                <p className="text-base text-gray-800 font-semibold">{item.title}</p>
              </div>
            ))}
          </div>

          <div className="w-full md:w-[600px] h-[600px] flex justify-center items-center">
            <img
              src="/public/images/design.gif"
              alt="Food on Train"
              className="w-full h-full object-contain"
              data-aos="zoom-in"
            />
          </div>

          <div className="flex flex-col gap-6">
            {[{ title: 'Gourmet', icon: '/public/images/gourmet.png' }, { title: 'Offers', icon: '/public/images/offer.png' }, { title: 'Collections', icon: '/public/images/buger.png' }].map((item, idx) => (
              <div
                key={idx}
                className="w-[160px] h-[150px] bg-white shadow-md rounded-xl flex flex-col items-center justify-center p-4 hover:scale-105 transition"
                data-aos="fade-left"
                data-aos-delay={idx * 100}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-16 h-16 object-contain mb-3"
                />
                <p className="text-base text-gray-800 font-semibold">{item.title}</p>
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



      {/* Feature Section with Icons */}
      <div className="relative bg-white w-full overflow-hidden" data-aos="fade-up">
        <div className="relative z-10 px-6 py-20 max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-pink-600 mb-4">
            Famous Jigarthanda <br /> Flavor Factors
          </h2>
          <p className="text-gray-600 text-lg mb-16">
            From Madurai with Love: A Taste Unmatched!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                title: "Tradition",
                desc: "Our brand has a long history dating back to 1977, showcasing a legacy of quality and tradition in our products.",
                icon: <Landmark className="w-12 h-12 text-orange-500" />,
              },
              {
                title: "Health-Focused",
                desc: "We don’t add preservatives or artificial colors to our products, that’s what makes us stand tall in our business!",
                icon: <HeartPulse className="w-12 h-12 text-green-500" />,
              },
              {
                title: "Timeless",
                desc: "Our product’s composition allows for enjoyment throughout the year, adapting to every climate and occasion.",
                icon: <Clock className="w-12 h-12 text-blue-500" />,
              },
              {
                title: "Unmatched Taste",
                desc: "MFJ LLP’s products shine as the symbol of taste, every ingredient is carefully chosen to create an unforgettable flavor.",
                icon: <Sparkles className="w-12 h-12 text-pink-500" />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-2xl p-6 text-left flex items-start gap-6 hover:shadow-xl transition"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div>{item.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-pink-600 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-2">{item.desc}</p>
                  <button className="text-orange-500 font-semibold underline">Explore</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      

   

  {/* Our Testimonial Section */}
<section id="testimonial" className="bg-white py-20 px-4 text-center" data-aos="fade-up">
  <h2 className="text-4xl font-bold text-pink-600 mb-4">What Our Customers Say</h2>
  <p className="text-gray-600 max-w-xl mx-auto mb-12">
    Real experiences from our happy customers!
  </p>

  {testimonials.length === 0 ? (
    <p className="text-gray-500">No testimonials yet.</p>
  ) : (
    <div className="relative max-w-6xl mx-auto">
      {/* Testimonials grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
        {paginatedTestimonials.map((item, idx) => (
          <div
            key={idx}
            className="relative bg-white border border-[#f2dfe6] rounded-2xl p-6 shadow-lg transition hover:scale-[1.03] duration-300 group"
          >
            <div className="absolute -top-5 left-5 bg-pink-100 text-white text-xl w-10 h-10 flex items-center justify-center rounded-full shadow-lg group-hover:rotate-12 transition duration-300">
              💬
            </div>
            <p className="text-gray-700 text-base italic mb-4 mt-6 leading-relaxed">
              “{item.message}”
            </p>
            <div className="border-t pt-4 mt-4">
              <h4 className="font-bold text-lg text-pink-400">{item.name}</h4>
              <span className="text-sm text-gray-500">{item.address || 'Happy Customer'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dot navigation */}
      {testimonials.length > itemsPerPage && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentPage === idx ? 'bg-[#660033] scale-125' : 'bg-gray-300'
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
<section className="bg-white py-20 px-4" data-aos="fade-up">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    
    {/* Map Section */}
    <div className="w-full" data-aos="fade-right">
      <h3 className="text-2xl font-bold text-pink-600 mb-4 text-center md:text-left">📍 Our Location</h3>
      <div className="w-full h-80">
        <iframe
          src="https://www.google.com/maps/embed?pb=..."
          className="w-full h-full rounded-xl border"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>

   {/* Contact Form */}
<div className="w-full md:pl-8" data-aos="fade-left">
  <h3 className="text-2xl font-bold text-pink-600 mb-4 text-center md:text-left">📬 Get in Touch</h3>
  <form
    className="bg-white border border-pink-300 p-6 rounded-xl shadow space-y-4"
    onSubmit={handleSubmit}
  >
    <input
      type="text"
      name="name"
      placeholder="Name"
      required
      className="w-full p-2 border border-pink-200 rounded focus:outline-pink-400"
    />
    <input
      type="email"
      name="email"
      placeholder="Email"
      required
      className="w-full p-2 border border-pink-200 rounded focus:outline-pink-400"
    />
    <input
      type="tel"
      name="phone"
      placeholder="Phone Number"
      required
      className="w-full p-2 border border-pink-200 rounded focus:outline-pink-400"
    />
    <input
      type="text"
      name="address"
      placeholder="Address"
      className="w-full p-2 border border-pink-200 rounded focus:outline-pink-400"
    />
    <textarea
      name="message"
      placeholder="Message"
      required
      rows="4"
      className="w-full p-2 border border-pink-200 rounded focus:outline-pink-400"
    ></textarea>
   <button
  type="submit"
  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition duration-300 shadow-md"
>
  Send
</button>

  </form>
</div>

  </div>
</section>



    </>
  );
};

export default Home;
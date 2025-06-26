import React from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import imagePaths from '../assets/imagePaths';
import resumePdf from '../assets/vignesh_resume.pdf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const About = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

 const handleDownload = () => {
  toast('📄..✅', {
    position: 'bottom-right',
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    closeButton: false,
    style: {
      background: 'transparent',
      boxShadow: 'none',
      fontSize: '2rem',
      textAlign: 'center',
    },
    bodyStyle: {
      padding: 0,
      margin: 0,
    }
  });
};


  return (
    <div className="min-h-screen bg-orange-50 px-4 sm:px-6 flex items-center justify-center">
      <ToastContainer />

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full max-w-5xl py-12">
        
        {/* Profile Image */}
        <div className="w-full md:w-1/2 flex justify-center" data-aos="fade-right">
          <img
            src={imagePaths.vignesh}
            alt="Vignesh"
            className="w-48 h-48 sm:w-60 sm:h-60 md:w-64 md:h-64 object-cover rounded-full shadow-lg border-4 border-[#660033]"
          />
        </div>

        {/* About Text */}
        <div className="w-full md:w-1/2 px-2 sm:px-4 space-y-5" data-aos="fade-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#660033] text-center md:text-left">
            Hi, I'm Vignesh R 👋
          </h1>

<p className="text-gray-700 text-base sm:text-lg leading-relaxed text-justify">
  I’m a passionate full‑stack developer from <strong>Karaikudi, Tamil Nadu</strong>, and I recently completed my MCA from <strong>Kumarasamy College of Engineering</strong>. I specialize in building clean, responsive, and user‑friendly web applications using the <strong>MERN stack</strong>.
  <br /><br />
  My strength lies in creating seamless digital experiences by combining strong backend logic with elegant frontend design. I enjoy solving real‑world problems and have honed my analytical and debugging skills through consistent practice on platforms like <strong>LeetCode</strong>, which helped me deepen my understanding of <strong>data structures and algorithms</strong>.
  <br /><br />
  As a fresher, I bring high energy, strong commitment, and real project experience. I'm eager to join a collaborative team where I can continue learning and contribute to meaningful tech solutions.
</p>




<p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center md:text-left">
 
  <strong>Email:</strong> vigneshramesh2208@gmail.com<br />
  <strong>Phone:</strong> 6380792434
</p>


          {/* Resume + Links */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 mt-4">
            <a
              href={resumePdf}
              download="Vignesh_R_Resume.pdf"
              onClick={handleDownload}
              className="bg-[#660033] text-white px-6 py-2 rounded hover:bg-pink-800 text-center transition"
            >
              📄 Download Resume
            </a>

            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-blue-600 underline text-sm">
              <a href="https://linkedin.com/in/vignesh-r-793931252/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://github.com/Vigneshr1422" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://vigneshas-portfolio.netlify.app" target="_blank" rel="noreferrer">Portfolio</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

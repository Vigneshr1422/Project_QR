import { useNavigate } from 'react-router-dom';

function Start() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/home');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
      >
<source src="/faludaa.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/40 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
          Dessert Tap QR Restaurant 🍨
        </h1>
        <button
          onClick={handleClick}
          className="px-6 py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Start;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import img1 from "../assets/img1.jpg";

const taglines = [
  "Track your inventory effortlessly",
  "Get AI-based crop suggestions",
  "Monitor livestock health smartly",
  "Receive alerts before product expiry",
  "Stay updated with real-time market prices"
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % taglines.length);
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${img1})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col justify-center items-center h-screen text-white text-center px-4 mt-5">
        <motion.h1
          className="text-6xl md:text-7xl font-extrabold drop-shadow-lg leading-tight tracking-wide"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Welcome to <span className="text-orange-500">AgroSync</span>
        </motion.h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            className="mt-9 max-w-2xl text-3xl md:text-xl  font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {taglines[currentIndex]}
          </motion.p>
        </AnimatePresence>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <Link
            to="/login"
            className="inline-block mt-10 px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-full text-white font-semibold text-lg shadow-md transition-all"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

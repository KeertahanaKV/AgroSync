import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer"; // 👈 NEW
import img1 from "../assets/img1.jpg";

const taglines = [
  "Track your farm inventory effortlessly",
  "Get AI-powered crop suggestions",
  "Monitor livestock health smartly",
  "Receive timely expiry alerts"
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { ref: featureRef, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${img1})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col justify-center items-center h-full text-white text-center px-4">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-xl"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Welcome to <span className="text-orange-500">AgroSync</span>
          </motion.h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              className="mt-8 text-2xl md:text-xl max-w-xl font-light text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {taglines[currentIndex]}
            </motion.p>
          </AnimatePresence>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 150 }}
          >
            <Link
              to="/login"
              className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg font-medium shadow-lg transition-all duration-300"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section
        ref={featureRef}
        className="bg-white py-16 px-6 md:px-20 text-gray-800"
      >
        {inView && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-center mb-10">
              What You Can Do With <span className="text-orange-500">AgroSync</span>
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <motion.div whileHover={{ scale: 1.05 }} className="bg-orange-50 p-6 rounded-xl shadow hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-2">📦 Inventory Tracking</h3>
                <p className="text-sm text-gray-600">
                  Manage seeds, fertilizers, and tools with expiry alerts and stock levels.
                </p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-orange-50 p-6 rounded-xl shadow hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-2">🌾 Crop Recommendations</h3>
                <p className="text-sm text-gray-600">
                  Get AI-based suggestions on which crop to grow based on soil & weather.
                </p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-orange-50 p-6 rounded-xl shadow hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-2">🐄 Livestock Monitoring</h3>
                <p className="text-sm text-gray-600">
                  Track symptoms and get disease predictions for your animals.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Home;

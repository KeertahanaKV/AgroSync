import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import farmervideo from "../assets/farmervideo.mp4";
import Login from "./Auth/Login";

const Home = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={farmervideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar />
      </div>

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

        <motion.p
          className="mt-6 max-w-2xl text-lg md:text-xl text-gray-100 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Revolutionizing agriculture with smart tools for inventory, crops,
          livestock, and beyond.
        </motion.p>

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

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold tracking-wider">
          CVSync
        </h1>

        <div className="space-x-6">
          <button
            onClick={() => navigate("/login")}
            className="hover:text-gray-300"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-white text-black px-5 py-2 rounded-xl font-semibold hover:scale-105 transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mt-28 px-6">

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-6xl font-extrabold leading-tight"
        >
          Sync Your Career <br /> With AI Precision
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-gray-400 max-w-xl"
        >
          CVSync intelligently analyzes resumes, predicts skill gaps,
          and matches opportunities using ML powered insights.
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 flex gap-5"
        >
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-110 transition"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-white px-8 py-4 rounded-2xl hover:bg-white hover:text-black transition"
          >
            Login
          </button>
        </motion.div>
      </div>

      {/* Floating Animated Background Blob */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
        }}
        className="absolute w-96 h-96 bg-purple-600 opacity-20 blur-3xl rounded-full top-40 left-20"
      />
    </div>
  );
}
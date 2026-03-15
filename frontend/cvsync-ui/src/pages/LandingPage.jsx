import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();

  //Typing animation
  const fullText =
    "CVSync intelligently analyzes resumes, predicts skill gaps and scores applications using ML.";

  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;

      if (i > fullText.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1d3a] via-[#384358] to-[#611f2c] text-white overflow-hidden relative">

      {/*BG*/}
      <div className="absolute inset-0 -z-10">

        <div className="absolute w-[700px] h-[700px] bg-[#ff5a5f] opacity-20 blur-[180px] rounded-full top-[-150px] left-[20%]" />

        <div className="absolute w-[600px] h-[600px] bg-[#ffa586] opacity-20 blur-[160px] rounded-full bottom-[-120px] right-[15%]" />

        <div className="absolute w-[500px] h-[500px] bg-[#384358] opacity-30 blur-[150px] rounded-full top-[40%] left-[30%]" />

      </div>

      {/* Navbar*/}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 z-50">
        <h1 className="text-2xl font-bold tracking-widest">CVSync</h1>

        <div className="flex gap-8 items-center">
          <button
            onClick={() => navigate("/about")}
            className="text-gray-200 hover:text-white transition"
          >
            About
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-white px-5 py-2 rounded-xl hover:bg-white hover:text-black transition"
          >
            Login
          </button>
        </div>
      </div>

      
      <div className="flex flex-col items-center justify-center text-center h-screen px-6 relative z-10">

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-6xl md:text-7xl font-extrabold leading-tight"
        >
          Sync Your CVs <br /> With AI Insights
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-gray-200 max-w-2xl text-lg leading-relaxed"
        >
          {typedText}
          <span className="animate-pulse">|</span>
        </motion.p>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex gap-6"
        >
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-black px-10 py-4 rounded-2xl font-semibold hover:scale-110 hover:shadow-2xl transition duration-300"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-white px-10 py-4 rounded-2xl hover:bg-white hover:text-black transition duration-300"
          >
            Login
          </button>
        </motion.div>

      </div>

      {/* animation */}
      <motion.div
        animate={{
          x: [0, 120, -60, 0],
          y: [0, -90, 70, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
        }}
        className="absolute w-96 h-96 bg-[#ff5a5f] opacity-20 blur-3xl rounded-full top-40 left-20"
      />

    </div>
  );
}
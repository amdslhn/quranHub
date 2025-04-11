import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.5, duration: 1.5, ease: "easeOut" },
  }),
};

const slowTextVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 1, duration: 2, ease: "easeOut" },
  }),
};

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => navigate("/list"),200);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={textVariants}
        custom={0}
        className="text-7xl font-extrabold mb-6 drop-shadow-lg text-center "
      >
        Selamat Datang di{" "}
        <motion.span
          initial="hidden"
          animate="visible"
          variants={slowTextVariants}
          custom={1}
          className="text-yellow-300"
        >
          QURANHUB
        </motion.span>
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={textVariants}
        custom={2}
        className="text-xl mb-8 max-w-lg text-center italic font-light "
      >
        Temukan dan baca Al-Qur'an{" "}
        <span className="block">Dekatkan diri dengan Al-Quran, dekatkan hati dengan Allah</span>
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={textVariants}
        custom={3}
        className="flex justify-center"
      >
        <motion.button
          onClick={handleClick}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="inset-shadow-sm inset-shadow-yellow-700 px-8 py-4 text-2xl bg-yellow-400 text-blue-900 font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition-all hover:cursor-pointer"
        >
          {isLoading ? "⏳ Loading..." : "📖 Baca Quran"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;

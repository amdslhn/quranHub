import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiFillChrome, AiFillHome } from "react-icons/ai";

const QuranList = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("surat");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const url =
        viewMode === "surat"
          ? "https://api.quran.com/api/v4/chapters?language=id"
          : "https://api.quran.com/api/v4/juzs?language=id";

      try {
        const response = await fetch(url);
        const result = await response.json();

        if (viewMode === "surat" && result.chapters) {
          setData(result.chapters);
          setFilteredData(result.chapters);
        } else if (viewMode === "juz" && result.juzs) {
          const uniqueJuzs = Object.values(
            result.juzs.reduce((acc, juz) => {
              acc[juz.juz_number] = juz;
              return acc;
            }, {})
          );
          setData(uniqueJuzs);
          setFilteredData(uniqueJuzs);
        } else {
          setData([]);
          setFilteredData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === "surat") {
      const filtered = (data || []).filter((surat) =>
        surat?.name_simple?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data, viewMode]);

  const convertToArabicNumeric = (number) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return number
      .toString()
      .split("")
      .map((digit) => arabicNumbers[digit])
      .join("");
  };

  const handleClick = (id) => {
    if (viewMode === "surat") {
      navigate(`/by_surah/${id}`);
    } else if (viewMode === "juz") {
      navigate(`/by_juz/${id}`);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1200px] mx-auto">
      <div className="flex hover:cursor-pointer" onClick={() => navigate("/")}>
        <AiFillHome className="mt-1 mr-2"/> <p className="">Home</p>
        </div>
        <motion.h1 
  className="text-5xl font-extrabold text-center bg-gradient-to-r from-yellow-400 via-black to-black-500 text-transparent bg-clip-text mb-16"
  initial={{ y: -30, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  QURANHUB
</motion.h1>
        <div className="flex justify-center space-x-4 mb-6">
          {["surat", "juz"].map((mode) => (
            <motion.button
              key={mode}
              className={`px-4 py-2 rounded-lg transition-all ${viewMode === mode ? "bg-black text-white" : "bg-white border border-gray-300 hover:cursor-pointer"}`}
              onClick={() => setViewMode(mode)}
              whileHover={{ scale: 1.1 }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </motion.button>
          ))}
        </div>

        {viewMode === "surat" && (
          <motion.div className="mb-4 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <input
              type="text"
              placeholder="Cari Surat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md p-2 border border-gray-300 rounded-lg"
            />
          </motion.div>
        )}

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
        >
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <motion.div
                onClick={() => handleClick(item.juz_number || item.id)}
                key={`${viewMode}-${item.juz_number || item.id}`}
                className="flex items-center justify-between p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-300 hover:scale-105 transition-all bg-white"
                variants={{ hidden: { opacity: 0, y: 0 }, visible: { opacity: 1, y: 0 } }}
                transition={{ delay: index * 0.05}}
              >
                <div className="flex items-center">
                  <div className="bg-yellow-400 w-12 h-12 flex items-center justify-center rounded-full mr-4">
                    <p className="font-bold">
                      {convertToArabicNumeric(item.juz_number || item.id)}
                    </p>
                  </div>
                  {viewMode === "surat" ? (
                    <div>
                      <p className="text-lg font-semibold">
                        {item.name_simple} <span> - {item.name_arabic}</span>
                      </p>
                      <span className="block">{item.verses_count} Ayat</span>
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold text-xl">
                        Juz {item.juz_number}
                      </div>
                      <span className="block">{item.verses_count} Ayat</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p className="text-center text-gray-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              Loading...
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuranList;

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import QoriDropdown from "./QoriDropdown";
import { IoIosArrowBack} from "react-icons/io";

function ChapterAyat() {
  const navigate = useNavigate();
  const [surat, setSurat] = useState({});
  const [ayat, setAyat] = useState([]);
  const { id } = useParams();
  const [translate, setTranslate] = useState([]);
  const [recitation, setRecitation] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingTranslate, setIsLoadingTranslate] = useState(true);
  const audioRef = useRef(null);

  const convertToArabicNumeric = (number) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return number
      .toString()
      .split("")
      .map((digit) => arabicNumbers[digit])
      .join("");
  };

  useEffect(() => {
    if (!recitation) return;
    fetch(`https://api.quran.com/api/v4/chapter_recitations/${recitation}/${id}`)
      .then((res) => res.json())
      .then((data) => setAudioUrl(data.audio_file?.audio_url || ""))
      .catch((err) => console.error("Error fetching audio:", err));
  }, [id, recitation]);

  useEffect(() => {
    fetch(`https://api.quran.com/api/v4/chapters/${id}?language=id`)
      .then((res) => res.json())
      .then((data) => setSurat(data.chapter || {}))
      .catch((err) => console.error("Error fetching chapter:", err));
  }, [id]);

  useEffect(() => {
    fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${id}`)
      .then((res) => res.json())
      .then((data) => setAyat(data.verses || []))
      .catch((err) => console.error("Error fetching ayat:", err));
  }, [id]);

  useEffect(() => {
    setIsLoadingTranslate(true);
    fetch(`https://api.quran.com/api/v4/quran/translations/33?chapter_number=${id}`)
      .then((res) => res.json())
      .then((data) => setTranslate(data.translations || []))
      .catch((err) => console.error("Error fetching translation:", err))
      .finally(() => setIsLoadingTranslate(false));
  }, [id]);

  const toggleAudio = () => {
    if (!recitation) {
      alert("Silakan pilih qori terlebih dahulu.");
      return;
    }
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] bg-white border border-gray-100 text-black text-center pt-3 pb-2 shadow-lg rounded-b-2xl backdrop-blur-lg z-50">
          <div className="flex items-center justify-center gap-4 mt-2">
            <button
            onClick={() => navigate("/list")}
            className= "absolute lg:top-2 lg:left-1 top-0 left-1 font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:cursor-pointer"
          >
            <IoIosArrowBack className="inline-block mb-1" /> Back
            </button>
            <div className="w-14 h-14 flex items-center justify-center rounded-full text-2xl font-bold bg-yellow-400 text-black shadow-md">
              {surat.id}
            </div>
            <h1 className="text-3xl font-extrabold">
              {surat.name_arabic} - {surat.name_simple}
            </h1>
          </div>
          <p className="text-md mt-1 lg:mt-0 font-semibold">
            Arti: {surat.translated_name?.name || "Tidak tersedia"}
          </p>
          <p className="text-md font-semibold">
            Tempat turun: {surat.revelation_place || "Tidak diketahui"}
          </p>
          <div className="flex items-center justify-between mt-2 px-4">
            <div className="relative group">
              <button onClick={toggleAudio} className="p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 hover:cursor-pointer">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {isPlaying ? "Pause Audio" : "Play Audio"}
              </span>
            </div>
            <QoriDropdown setRecitation={setRecitation} />
          </div>
        </div>

        <audio ref={audioRef} src={audioUrl || null} onEnded={() => setIsPlaying(false)} />

        {isLoadingTranslate ? (
          <div className="text-center text-gray-600 text-lg mt-10 animate-pulse">
            Memuat terjemahan...
          </div>
        ) : (
          <div className="mt-56 space-y-4 ">
            {ayat.map((item, index) => (
              <div key={item.verse_key} className="p-4 bg-white shadow-md rounded-lg text-right">
                <p className="text-3xl/relaxed text-gray-900 mb-6 noto">
                  {item.text_uthmani} <span className="text-2xl"> ({convertToArabicNumeric(item.verse_key.split(":")[1])}) </span>
                </p>
                <p className="text-left text-lg text-gray-700">
                  {translate[index]?.text?.replace(/<sup.*?<\/sup>/g, "") || "Terjemahan tidak tersedia."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChapterAyat;

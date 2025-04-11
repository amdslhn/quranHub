import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Spinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
  </div>
);

function ChapterJuz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [groupedAyat, setGroupedAyat] = useState({});
  const [surahDetails, setSurahDetails] = useState({});
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const convertToArabicNumeric = (number) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return number
      .toString()
      .split("")
      .map((digit) => arabicNumbers[digit])
      .join("");
  };

  const getAyatRange = (ayatList) => {
    if (ayatList.length === 0) return "";
    const first = ayatList[0].verse_key.split(":")[1];
    const last = ayatList[ayatList.length - 1].verse_key.split(":")[1];
    return `Ayat ${first} - ${last}`;
  };

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?juz_number=${id}`)
      .then((res) => res.json())
      .then((data) => {
        groupBySurah(data.verses);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching ayat:", err);
        setLoading(false);
      });

    fetch("https://api.quran.com/api/v4/chapters")
      .then((res) => res.json())
      .then((data) => {
        const details = {};
        data.chapters.forEach((chapter) => {
          details[chapter.id] = {
            arabicName: chapter.name_arabic,
            englishName: chapter.name_simple,
            revelationPlace: chapter.revelation_place.toUpperCase(),
            totalVerses: chapter.verses_count,
          };
        });
        setSurahDetails(details);
      })
      .catch((err) => console.error("Error fetching surah details:", err));
  }, [id]);

  useEffect(() => {
    const fetchTranslations = async () => {
      const transData = {};
      setLoadingTranslation(true);
      await Promise.all(
        Object.values(groupedAyat)
          .flat()
          .map(async (verse) => {
            try {
              const res = await fetch(
                `https://api.quran.com/api/v4/quran/translations/33?verse_key=${verse.verse_key}`
              );
              const data = await res.json();

              if (data.translations && data.translations.length > 0) {
                transData[verse.verse_key] = data.translations[0].text;
              } else {
                transData[verse.verse_key] = "Terjemahan tidak ditemukan.";
              }
            } catch (error) {
              console.error(
                `Error fetching translation for ${verse.verse_key}:`,
                error
              );
              transData[verse.verse_key] = "Gagal memuat terjemahan.";
            }
          })
      );
      setTranslations(transData);
      setLoadingTranslation(false);
    };

    if (Object.keys(groupedAyat).length) fetchTranslations();
  }, [groupedAyat]);

  const groupBySurah = (verses) => {
    const grouped = {};
    verses.forEach((verse) => {
      const [surahNumber] = verse.verse_key.split(":");
      if (!grouped[surahNumber]) {
        grouped[surahNumber] = [];
      }
      grouped[surahNumber].push(verse);
    });
    setGroupedAyat(grouped);
  };

  const prevJuz = () => {
    if (parseInt(id) > 1) {
      navigate(`/by_juz/${parseInt(id) - 1}`);
    }
  };

  const nextJuz = () => {
    if (parseInt(id) < 30) {
      navigate(`/by_juz/${parseInt(id) + 1}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1200px] mx-auto">
        <button
          onClick={() => navigate("/list")}
          className="absolute lg:top-2 lg:left-40 top-2 left-2 font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:cursor-pointer"
        >
          <IoIosArrowBack className="inline-block" /> Back
        </button>
        <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800 drop-shadow-lg">
          Juz {id}
        </h1>
        <div
          className={`mb-6 ${
            parseInt(id) === 1 ? "flex justify-end" : "flex justify-between"
          }`}
        >
          {parseInt(id) > 1 && (
            <button
              onClick={prevJuz}
              className="px-2 py-3 bg-white shadow-md border border-gray-200 text-black font-semibold rounded-xl transition duration-300 ease-in-out hover:scale-105 hover:cursor-pointer"
            >
              <IoIosArrowBack className="inline-block" /> Juz Sebelumnya
            </button>
          )}
          {parseInt(id) < 30 && (
            <button
              onClick={nextJuz}
              className="px-2 py-3 bg-white shadow-md border border-gray-200 font-semibold rounded-xl transition duration-300 ease-in-out hover:scale-105 hover:cursor-pointer"
            >
              Juz Selanjutnya <IoIosArrowForward className="inline-block" />
            </button>
          )}
        </div>
        {loading || loadingTranslation ? (
          <Spinner />
        ) : (
          <div className="mt-10 space-y-8">
            {Object.entries(groupedAyat).map(([surah, ayatList]) => {
              const surahInfo = surahDetails[surah] || {};

              return (
                <div
                  key={surah}
                  className="bg-white shadow-md p-6 rounded-2xl border border-gray-100"
                >
                  <div className="text-center">
                    <h2 className="text-4xl font-extrabold noto text-gray-800">
                      {surahInfo.arabicName || "Memuat..."}
                    </h2>
                    <p className="text-gray-600 font-bold text-lg italic">
                      {surahInfo.englishName || `Surah ${surah}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 font-semibold">
                      {surahInfo.revelationPlace}
                      <span className="block">{getAyatRange(ayatList)}</span>
                    </p>
                  </div>
                  <hr className="my-4 border-gray-300" />
                  <div className="space-y-4">
                    {ayatList.map((ayat) => (
                      <div
                        key={ayat.verse_key}
                        className="p-4 bg-white shadow-md rounded-lg text-right"
                      >
                        <p className="text-3xl/relaxed text-gray-900 mb-6 noto">
                          {ayat.text_uthmani}{" "}
                          <span className="text-2xl">
                            ({convertToArabicNumeric(
                              ayat.verse_key.split(":" )[1]
                            )})
                          </span>
                        </p>
                        <p
                          className="text-left text-lg text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html:
                              translations[ayat.verse_key] ||
                              "Terjemahan tidak tersedia.",
                          }}
                        ></p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChapterJuz;
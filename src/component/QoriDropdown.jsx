import { useEffect, useState } from "react";

function QoriDropdown({ setRecitation }) {
  const [reciters, setReciters] = useState({ murattal: [], mujawwad: [], others: [] });

  useEffect(() => {
    fetch("https://api.quran.com/api/v4/resources/recitations")
      .then((response) => response.json())
      .then((data) => {
      
        if (!data || !data.recitations) {
          console.error("Data recitations tidak ditemukan.");
          return;
        }

  
        const murattal = [];
        const mujawwad = [];
        const others = [];

        data.recitations.forEach((reciter) => {
          if (reciter.style && reciter.style.toLowerCase() === "murattal") {
            murattal.push(reciter);
          } else if (reciter.style && reciter.style.toLowerCase() === "mujawwad") {
            mujawwad.push(reciter);
          } else {
            others.push(reciter);
          }
        });

        setReciters({ murattal, mujawwad, others });
      })
      .catch((error) => console.error("Error fetching reciters:", error));
  }, []);

  return (
    <div className="w-64 ml-auto mb-5 mr-2">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Pilih Qori
      </label>
      <select
        onChange={(e) => setRecitation(e.target.value)}
        className="w-full border rounded p-2"
      >
        <option value="Pilih Qori">Pilih Qori</option>
        {reciters.others.length > 0 && (
          <optgroup label="Pilih Qori yang anda inginkan">
            {reciters.others.map((reciter) => (
              <option key={reciter.id} value={reciter.id}>
                {reciter.reciter_name}
              </option>
            ))}
          </optgroup>
        )}

        {reciters.murattal.length > 0 && (
          <optgroup label="Murattal">
            {reciters.murattal.map((reciter) => (
              <option key={reciter.id} value={reciter.id}>
                {reciter.reciter_name}
              </option>
            ))}
          </optgroup>
        )}

        {reciters.mujawwad.length > 0 && (
          <optgroup label="Mujawwad">
            {reciters.mujawwad.map((reciter) => (
              <option key={reciter.id} value={reciter.id}>
                {reciter.reciter_name}
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  );
}

export default QoriDropdown;

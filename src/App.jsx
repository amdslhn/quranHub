import { BrowserRouter, Routes, Route} from "react-router-dom";

import PerAyat from "./Pages/PerAyat";
import Perjuz from "./Pages/PerJuz";
import HomePage from "./Pages/HomePage";
import List from "./Pages/List";



function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/list" element={<List />} />
            <Route path="/by_surah/:id" element={<PerAyat />} />
            <Route path ="/by_juz/:id" element={<Perjuz />} />
        </Routes>
    );
}

export default App;
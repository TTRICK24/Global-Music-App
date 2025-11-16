import { useState, useEffect } from "react";
import { getSongs } from "./api/shazam";

function App() {
  const [country, setCountry] = useState("US");
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    getSongs(country).then(data => {
      console.log(data); // check if API works
      setSongs(data);
    });
  }, [country]);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold">Global Music Trends</h1>

      {/* Temporary: show first song title */}
      <p className="mt-5">{songs[0]?.title}</p>
    </div>
  );
}

export default App;

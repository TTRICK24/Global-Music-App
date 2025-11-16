// src/App.jsx
import { useMemo, useState } from "react";
import "./App.css";

/* ---------------------------------- DATA ---------------------------------- */

const COUNTRIES = [
  "All Countries",
  "China",
  "Korea",
  "Japan",
  "UK",
  "India",
  "US",
  "Australia",
  "Brazil",
  "France",
  "South Africa",
  "Mexico",
  "Egypt",
];

const TOP_100 = {
  Korea: [
    { rank: 1, title: "Perfect Night", artist: "LE SSERAFIM", genre: "K-Pop", country: "Korea" },
    { rank: 2, title: "Super Shy", artist: "NewJeans", genre: "K-Pop", country: "Korea" },
    { rank: 3, title: "Seven", artist: "Jung Kook", genre: "K-Pop", country: "Korea" },
    { rank: 4, title: "ETA", artist: "NewJeans", genre: "K-Pop", country: "Korea" },
    { rank: 5, title: "OMG", artist: "NewJeans", genre: "K-Pop", country: "Korea" },
  ],
  US: [
    { rank: 1, title: "Flowers", artist: "Miley Cyrus", genre: "Pop", country: "US" },
    { rank: 2, title: "Cruel Summer", artist: "Taylor Swift", genre: "Pop", country: "US" },
    { rank: 3, title: "Calm Down", artist: "Rema & Selena Gomez", genre: "Afrobeats", country: "US" },
  ],
  Japan: [
    { rank: 1, title: "アイドル (Idol)", artist: "YOASOBI", genre: "J-Pop", country: "Japan" },
    { rank: 2, title: "Subtitle", artist: "Official HIGE DANDism", genre: "J-Pop", country: "Japan" },
  ],
  UK: [
    { rank: 1, title: "Sprinter", artist: "Dave & Central Cee", genre: "UK Rap", country: "UK" },
    { rank: 2, title: "Dance The Night", artist: "Dua Lipa", genre: "Pop", country: "UK" },
  ],
  India: [
    { rank: 1, title: "Heeriye", artist: "Arijit Singh", genre: "Bollywood", country: "India" },
    { rank: 2, title: "Kesariya", artist: "Arijit Singh", genre: "Bollywood", country: "India" },
  ],
  China: [
    { rank: 1, title: "光点", artist: "Xiao Zhan", genre: "C-Pop", country: "China" },
  ],
  Australia: [
    { rank: 1, title: "Dance Monkey", artist: "Tones and I", genre: "Pop", country: "Australia" },
  ],
  Brazil: [
    { rank: 1, title: "Envolver", artist: "Anitta", genre: "Funk / Pop", country: "Brazil" },
  ],
  France: [
    { rank: 1, title: "La quête", artist: "Orelsan", genre: "Rap Français", country: "France" },
  ],
  "South Africa": [
    { rank: 1, title: "Mnike", artist: "Tyler ICU", genre: "Amapiano", country: "South Africa" },
  ],
  Mexico: [
    { rank: 1, title: "Ella Baila Sola", artist: "Peso Pluma", genre: "Regional", country: "Mexico" },
  ],
  Egypt: [
    { rank: 1, title: "Etnaset", artist: "Ramadan", genre: "Arabic Pop", country: "Egypt" },
  ],
};

const GLOBAL_LIST = Object.values(TOP_100).flat();
const GENRES = [
  "All Genres",
  ...Array.from(new Set(GLOBAL_LIST.map((t) => t.genre))),
];

/* ---------------------------- SONG TABLE COMPONENT --------------------------- */

function SongTable({ tracks }) {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="mt-8 max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-950/95 p-6 text-center shadow-[0_20px_40px_rgba(15,23,42,0.85)]">
        <h3 className="text-lg font-semibold text-slate-100">No songs found</h3>
        <p className="mt-1 text-sm text-slate-400">Try different filters.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.85)]">
      <div className="grid grid-cols-[40px,1.8fr,1.5fr,1fr,1fr] gap-3 px-2 pb-2 text-[0.7rem] uppercase tracking-[0.15em] text-slate-400">
        <span className="text-right">#</span>
        <span>Title</span>
        <span>Artist</span>
        <span>Genre</span>
        <span>Country</span>
      </div>

      <div className="max-h-[520px] overflow-y-auto rounded-xl border border-slate-800/90 bg-slate-950/70">
        {tracks.map((t, i) => (
          <div
            key={`${t.country}-${t.rank}-${t.title}`}
            className="grid grid-cols-[40px,1.8fr,1.5fr,1fr,1fr] gap-3 border-b border-slate-800/80 px-3 py-2 text-sm text-slate-100 last:border-b-0 hover:bg-slate-900/70"
          >
            <span className="text-right font-mono text-slate-400">{i + 1}</span>
            <span className="font-medium">{t.title}</span>
            <span className="text-[0.8rem] text-slate-400">{t.artist}</span>
            <span className="text-[0.8rem] text-slate-300">{t.genre}</span>
            <span className="text-[0.8rem] text-slate-300">{t.country}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- APP ---------------------------------- */

export default function App() {
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [genreFilter, setGenreFilter] = useState("All Genres");

  const filteredTracks = useMemo(() => {
    const baseList =
      countryFilter === "All Countries"
        ? GLOBAL_LIST
        : TOP_100[countryFilter] || [];

    return baseList.filter((t) => {
      return genreFilter === "All Genres" || t.genre === genreFilter;
    });
  }, [countryFilter, genreFilter]);

  const handleReset = () => {
    setCountryFilter("All Countries");
    setGenreFilter("All Genres");
  };

  const resetDisabled =
    countryFilter === "All Countries" && genreFilter === "All Genres";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black px-5 py-6 text-slate-100">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-bold tracking-[0.15em] text-slate-50">GLOBAL TOP 100</h1>
          <p className="mt-1 text-sm text-slate-400">Explore the world's trending songs.</p>
        </header>

        {/* FILTERS */}
        <div className="mt-6 flex items-start justify-between gap-6">

          {/* LEFT — COUNTRY */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Country</label>
            <select
              className="w-52 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* RIGHT — GENRE + RESET */}
          <div className="flex flex-col gap-3 items-end">
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Genre
              </label>
              <select
                className="w-52 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                {GENRES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleReset}
              disabled={resetDisabled}
              className={`inline-flex w-fit items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition ${
                resetDisabled
                  ? "cursor-not-allowed border border-slate-700 bg-slate-900 text-slate-500"
                  : "border border-cyan-400/80 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20"
              }`}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* SONG TABLE */}
        <SongTable tracks={filteredTracks} />

      </div>
    </div>
  );
}

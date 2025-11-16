import { useState, useEffect } from 'react';
import { getTopTracksByCountry } from '../api/lastfm';
import './Home.css';

function Home() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [country, setCountry] = useState('united states');

    // Global Mix state
    const [globalMixSongs, setGlobalMixSongs] = useState([]);
    const [globalMixLoading, setGlobalMixLoading] = useState(false);
    const [showGlobalMix, setShowGlobalMix] = useState(false);

    const countries = [
        { name: 'united states', flag: '🇺🇸' },
        { name: 'united kingdom', flag: '🇬🇧' },
        { name: 'spain', flag: '🇪🇸' },
        { name: 'france', flag: '🇫🇷' },
        { name: 'germany', flag: '🇩🇪' },
        { name: 'japan', flag: '🇯🇵' },
        { name: 'brazil', flag: '🇧🇷' },
        { name: 'canada', flag: '🇨🇦' },
        { name: 'australia', flag: '🇦🇺' },
        { name: 'mexico', flag: '🇲🇽' },
        { name: 'italy', flag: '🇮🇹' },
    ];

    useEffect(() => {
        async function fetchSongs() {
            try {
                setLoading(true);
                const data = await getTopTracksByCountry(country, 50);
                console.log('API Response:', data);
                setSongs(data || []);
            } catch (err) {
                console.error('Full Error:', err);
                setError(`Failed to load songs: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }

        fetchSongs();
    }, [country]);

    const generateGlobalMix = async () => {
        setGlobalMixLoading(true);
        setShowGlobalMix(true);

        try {
            const uniqueSongs = [];
            const seenSongs = new Set();
            let attempts = 0;
            const maxAttempts = 30;

            while (uniqueSongs.length < 20 && attempts < maxAttempts) {
                const shuffled = [...countries].sort(() => Math.random() - 0.5);
                const randomCountry = shuffled[0];

                const tracks = await getTopTracksByCountry(randomCountry.name, 3);

                for (const track of tracks) {
                    const songKey = `${track.name.toLowerCase()}-${track.artist.toLowerCase()}`;

                    if (!seenSongs.has(songKey) && uniqueSongs.length < 20) {
                        seenSongs.add(songKey);
                        uniqueSongs.push({
                            ...track,
                            country: randomCountry.name,
                            flag: randomCountry.flag
                        });
                    }
                }

                attempts++;
            }

            const shuffledPlaylist = uniqueSongs.sort(() => Math.random() - 0.5);
            setGlobalMixSongs(shuffledPlaylist);
        } catch (err) {
            console.error('Error generating global mix:', err);
        } finally {
            setGlobalMixLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-2xl">Loading top songs... 🎵</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <>
            {/* Sticky Header */}
            <header className="sticky-header">
                <div className="header-container">
                    {/* Logo and Page Name */}
                    <div className="header-left">
                        <div className="header-logo">🎵</div>
                        <h1 className="header-title">GlobalCharts</h1>
                    </div>

                    {/* Country Selector */}
                    <div className="header-right">
                        <label htmlFor="country" className="header-label">
                            Country
                        </label>
                        <select
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="header-select"
                        >
                            <option value="">Select Country</option>
                            <option value="united states">🇺🇸 United States</option>
                            <option value="united kingdom">🇬🇧 United Kingdom</option>
                            <option value="spain">🇪🇸 Spain</option>
                            <option value="france">🇫🇷 France</option>
                            <option value="germany">🇩🇪 Germany</option>
                            <option value="japan">🇯🇵 Japan</option>
                            <option value="brazil">🇧🇷 Brazil</option>
                            <option value="canada">🇨🇦 Canada</option>
                            <option value="australia">🇦🇺 Australia</option>
                            <option value="mexico">🇲🇽 Mexico</option>
                            <option value="italy">🇮🇹 Italy</option>
                            <option value="netherlands">🇳🇱 Netherlands</option>
                            <option value="sweden">🇸🇪 Sweden</option>
                            <option value="india">🇮🇳 India</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="main-content">

                <div className="w-[700px] mx-auto grid gap-4">
                    {songs.slice(0, 50).map((song, index) => (
                        <div
                            key={song.mbid || index}
                            className="bg-gray-900 rounded-lg p-5 hover:bg-gray-800 transition-colors flex items-center gap-4"
                        >
                            <div className="text-2xl font-bold text-gray-500 w-12">
                                #{index + 1}
                            </div>

                            <div className="flex-1">
                                <h2 className="text-xl font-bold">
                                    {song.name || 'Unknown Title'}
                                </h2>
                                <p className="text-gray-400">
                                    {song.artist || 'Unknown Artist'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {song.playcount && `${parseInt(song.playcount).toLocaleString()} plays`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Generate Global Mix Button */}
                <div className="w-[700px] mx-auto mt-12 mb-8">
                    <button
                        onClick={generateGlobalMix}
                        disabled={globalMixLoading}
                        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {globalMixLoading ? '🌍 Generating Your Global Mix...' : '🌍 Generate Global Mix Playlist'}
                    </button>
                </div>

                {/* Global Mix Section */}
                {showGlobalMix && (
                    <div className="mt-16 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 rounded-xl">
                        <h2 className="text-4xl font-bold text-white text-center mb-4">
                            🌍 Global Mix Playlist
                        </h2>
                        <p className="text-center text-white/80 mb-8 text-lg">
                            20 songs from around the world to expand your music taste! 🎵
                        </p>

                        {globalMixLoading ? (
                            <div className="text-center text-white/80">Loading your global mix...</div>
                        ) : (
                            <div className="flex justify-center w-full px-4">
                                <div className="w-[800px] space-y-3">
                                    {globalMixSongs.map((song, index) => (
                                        <div
                                            key={index}
                                            className="bg-white/10 backdrop-blur-lg rounded-lg p-4 hover:bg-white/20 transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                {/* Left side: Index + Song Info */}
                                                <div className="flex items-center gap-6">
                                                    {/* Index Number */}
                                                    <div className="text-3xl font-bold text-white/80 w-12 flex-shrink-0 text-center">
                                                        {index + 1}
                                                    </div>

                                                    {/* Song Info */}
                                                    <div className="flex-shrink-0">
                                                        <h3 className="font-bold text-white text-lg mb-1" title={song.name}>
                                                            {song.name}
                                                        </h3>
                                                        <p className="text-white/70 text-sm" title={song.artist}>
                                                            {song.artist}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Right side: Country Badge */}
                                                <div className="flex-shrink-0 ml-4">
                                                    <span className="text-white/60 text-xs capitalize bg-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                                                        {song.country}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default Home;

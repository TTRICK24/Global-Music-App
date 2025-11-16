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
                        <h1 className="header-title">GlobalChartify</h1>
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

            {/* Banner - Top 50 Charts */}
            <div className="charts-banner">
                <div className="banner-content">
                    <span className="banner-text">Top 50 Charts</span>
                    {country && <span className="banner-country">: {country.charAt(0).toUpperCase() + country.slice(1)}</span>}
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">

                {!country ? (
                    <div className="w-[800px] mx-auto text-center py-16">
                        <p className="text-2xl text-gray-400">Select a country to get started!</p>
                    </div>
                ) : (
                    <div className="w-[800px] mx-auto space-y-6">
                        {songs.slice(0, 50).map((song, index) => (
                            <div
                                key={song.mbid || index}
                                className="song-card"
                            >
                                <div className="song-card-rank">
                                    {index + 1}
                                </div>

                                <div className="song-card-info">
                                    <h2 className="song-card-title">
                                        {song.name || 'Unknown Title'}
                                    </h2>
                                    <p className="song-card-artist">
                                        {song.artist || 'Unknown Artist'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {country && (
                    <>
                        {/* Generate Global Mix Button */}
                        <div className="w-[800px] mx-auto mt-12 mb-8 flex justify-center">
                            <button
                                onClick={generateGlobalMix}
                                disabled={globalMixLoading}
                                className="generate-playlist-btn"
                            >
                                {globalMixLoading ? 'Generating Your Global Mix...' : 'Generate Random Playlist!'}
                            </button>
                        </div>

                        {/* Global Mix Section */}
                        {showGlobalMix && (
                            <div className="mt-16">
                                <h2 className="text-3xl font-semibold text-white text-center mb-8">
                                    🌍 Global Mix Playlist
                                </h2>

                                {globalMixLoading ? (
                                    <div className="text-center text-gray-400">Loading your global mix...</div>
                                ) : (
                                    <div className="w-[800px] mx-auto">
                                        {globalMixSongs.map((song, index) => (
                                            <div
                                                key={index}
                                                className="song-item"
                                            >
                                                <div className="song-rank">
                                                    #{index + 1}
                                                </div>

                                                <div className="song-info">
                                                    <h3 className="song-title">
                                                        {song.name}
                                                    </h3>
                                                    <p className="song-artist">
                                                        {song.artist}
                                                    </p>
                                                </div>

                                                <div className="country-badge">
                                                    {song.country}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Home;

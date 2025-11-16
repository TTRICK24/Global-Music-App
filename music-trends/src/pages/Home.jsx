import { useState, useEffect } from 'react';
import { getTopTracksByCountry } from '../api/lastfm';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [country, setCountry] = useState('united states');
    const navigate = useNavigate();

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
    }, [country]); // Re-fetch when country changes

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
        <div className="min-h-screen bg-black text-white p-10">
            <h1 className="text-4xl font-bold mb-4 text-center">
                � Global Music Trends - Top Tracks
            </h1>

            {/* Action Buttons */}
            <div className="max-w-md mx-auto mb-6 flex gap-4">
                <button
                    onClick={() => navigate('/global-mix')}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                    🌍 Create Global Mix
                </button>
            </div>

            {/* Country Selector */}
            <div className="max-w-md mx-auto mb-8">
                <label htmlFor="country" className="block text-sm font-medium mb-2">
                    Select Country:
                </label>
                <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
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

            <div className="max-w-6xl mx-auto grid gap-4">
                {songs.slice(0, 50).map((song, index) => (
                    <div
                        key={song.mbid || index}
                        className="bg-gray-900 rounded-lg p-5 hover:bg-gray-800 transition-colors flex items-center gap-4"
                    >
                        <div className="text-2xl font-bold text-gray-500 w-12">
                            #{index + 1}
                        </div>

                        {song.image?.[2]?.['#text'] && (
                            <img
                                src={song.image[2]['#text']}
                                alt={song.name}
                                className="w-20 h-20 rounded-md object-cover"
                            />
                        )}

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
        </div>
    );
}

export default Home;

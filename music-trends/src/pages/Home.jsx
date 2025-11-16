import { useState, useEffect } from 'react';
import { getGlobalTop200 } from '../api/shazam';

function Home() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchSongs() {
            try {
                setLoading(true);
                setError(null);

                // Fetch global top 200 songs
                const data = await getGlobalTop200();
                console.log('API Response:', data); // Check the data in console

                // The API returns songs in different formats, adjust as needed
                setSongs(data || []);
            } catch (err) {
                console.error('Error fetching songs:', err);
                setError('Failed to load songs. Please check your API key.');
            } finally {
                setLoading(false);
            }
        }

        fetchSongs();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-bold">Loading top songs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold text-center mb-8">
                🎵 Global Top 200 Songs
            </h1>

            <div className="max-w-4xl mx-auto">
                {songs.length === 0 ? (
                    <p className="text-center text-gray-600">No songs found</p>
                ) : (
                    <div className="grid gap-4">
                        {songs.slice(0, 20).map((song, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl font-bold text-gray-400 w-8">
                                        #{index + 1}
                                    </div>

                                    {song.images?.coverart && (
                                        <img
                                            src={song.images.coverart}
                                            alt={song.title}
                                            className="w-16 h-16 rounded object-cover"
                                        />
                                    )}

                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">
                                            {song.title || 'Unknown Title'}
                                        </h3>
                                        <p className="text-gray-600">
                                            {song.subtitle || 'Unknown Artist'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;

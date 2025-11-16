import { useState, useEffect } from 'react';
import { getTopTracksByCountry } from '../api/lastfm';
import { useNavigate } from 'react-router-dom';

function GlobalMix() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const countries = [
        { name: 'united states', flag: '🇺🇸' },
        { name: 'united kingdom', flag: '🇬🇧' },
        { name: 'spain', flag: '🇪🇸' },
        { name: 'france', flag: '🇫🇷' },
        { name: 'germany', flag: '🇩🇪' },
        { name: 'japan', flag: '🇯🇵' },
        { name: 'brazil', flag: '�🇷' },
        { name: 'canada', flag: '��' },
        { name: 'australia', flag: '🇦🇺' },
        { name: 'mexico', flag: '🇲🇽' },
        { name: 'italy', flag: '��' },
    ];

    const generateGlobalMix = async () => {
        setLoading(true);
        setError(null);

        try {
            const uniqueSongs = [];
            const seenSongs = new Set();
            let attempts = 0;
            const maxAttempts = 30; // Increased to ensure we get 20 songs

            // Keep fetching until we have 20 unique songs
            while (uniqueSongs.length < 20 && attempts < maxAttempts) {
                // Shuffle countries and pick a random one
                const shuffled = [...countries].sort(() => Math.random() - 0.5);
                const randomCountry = shuffled[0];

                console.log(`Attempt ${attempts + 1}: Fetching from ${randomCountry.name}`);

                // Get 3 songs from this country
                const tracks = await getTopTracksByCountry(randomCountry.name, 3);

                // Add unique songs
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
                console.log(`Current unique songs: ${uniqueSongs.length}`);
            }

            console.log('Final unique songs:', uniqueSongs.length);

            // Shuffle the final playlist
            const shuffledPlaylist = uniqueSongs.sort(() => Math.random() - 0.5);

            setSongs(shuffledPlaylist);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateGlobalMix();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-2xl">🌍 Generating your global mix...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        ← Back to Charts
                    </button>

                    <h1 className="text-4xl font-bold text-white text-center flex-1">
                        🌍 Global Mix Playlist
                    </h1>

                    <button
                        onClick={generateGlobalMix}
                        className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-lg font-semibold transition-all transform hover:scale-105"
                    >
                        🔄 Generate New Mix
                    </button>
                </div>

                <p className="text-center text-white/80 mb-8 text-lg">
                    20 songs from around the world to expand your music taste! 🎵
                </p>

                {/* Centered container with controlled width */}
                <div className="flex justify-center w-full px-4">
                    <div className="w-[800px] space-y-3">
                        {songs.map((song, index) => (
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
            </div>
        </div>
    );
}

export default GlobalMix;

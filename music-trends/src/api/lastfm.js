import axios from "axios";

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const BASE_URL = 'http://ws.audioscrobbler.com/2.0/';

// Debug: Check if API key is loaded
console.log('Last.fm API Key loaded:', API_KEY ? 'Yes ✓' : 'No ✗');

// Get top tracks by country
export async function getTopTracksByCountry(country = 'united states', limit = 20) {
    try {
        const res = await axios.get(BASE_URL, {
            params: {
                method: 'geo.gettoptracks',
                country: country,
                limit: limit,
                api_key: API_KEY,
                format: 'json'
            }
        });

        console.log('Last.fm API Response:', res.data);
        return res.data.tracks?.track || [];
    } catch (error) {
        console.error('Error fetching Last.fm tracks:', error);
        throw error;
    }
}

// Get global top tracks (worldwide)
export async function getGlobalTopTracks(limit = 20) {
    try {
        const res = await axios.get(BASE_URL, {
            params: {
                method: 'chart.gettoptracks',
                limit: limit,
                api_key: API_KEY,
                format: 'json'
            }
        });

        console.log('Global tracks response:', res.data);
        return res.data.tracks?.track || [];
    } catch (error) {
        console.error('Error fetching global tracks:', error);
        throw error;
    }
}

// Search for tracks
export async function searchTracks(query, limit = 20) {
    try {
        const res = await axios.get(BASE_URL, {
            params: {
                method: 'track.search',
                track: query,
                limit: limit,
                api_key: API_KEY,
                format: 'json'
            }
        });

        console.log('Search results:', res.data);
        return res.data.results?.trackmatches?.track || [];
    } catch (error) {
        console.error('Error searching tracks:', error);
        throw error;
    }
}

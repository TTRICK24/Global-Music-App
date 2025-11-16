import axios from "axios";

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const BASE_URL = 'https://shazam-core.p.rapidapi.com';

// Debug: Check if API key is loaded
console.log('API Key loaded:', API_KEY ? 'Yes ✓' : 'No ✗');
console.log('API Key (first 10 chars):', API_KEY?.substring(0, 10));

// Get top songs by country
export async function getSongs(countryCode = 'US') {
  const options = {
    method: 'GET',
    url: `${BASE_URL}/charts/track`,
    params: {
      locale: `en-${countryCode}`,
      listId: `ip-country-chart-${countryCode}`,
      pageSize: '20'
    },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com'
    }
  };

  try {
    const res = await axios.request(options);
    console.log('Country songs response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching songs:', error.response?.data || error);
    throw error;
  }
}

// Get global top 200 songs (using Multi search as workaround since charts don't work)
export async function getGlobalTop200() {
  const options = {
    method: 'GET',
    url: `${BASE_URL}/v1/search/multi`,
    params: {
      query: 'top hits 2024',
      search_type: 'SONGS'
    },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com'
    }
  };

  try {
    const res = await axios.request(options);
    console.log('Raw API response:', res.data);
    // Multi search returns data in tracks.hits array
    return res.data?.tracks?.hits || res.data || [];
  } catch (error) {
    console.error('Error fetching songs:', error.response?.data || error);
    throw error;
  }
}

// Get song details by ID
export async function getSongDetails(songId) {
  const options = {
    method: 'GET',
    url: `${BASE_URL}/tracks/details`,
    params: { track_id: songId },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com'
    }
  };

  try {
    const res = await axios.request(options);
    return res.data;
  } catch (error) {
    console.error('Error fetching song details:', error);
    throw error;
  }
}

// Search for songs
export async function searchSongs(query) {
  const options = {
    method: 'GET',
    url: `${BASE_URL}/search/multi`,
    params: {
      query: query,
      search_type: 'SONGS'
    },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com'
    }
  };

  try {
    const res = await axios.request(options);
    return res.data;
  } catch (error) {
    console.error('Error searching songs:', error);
    throw error;
  }
}

import axios from "axios";

export async function getSongs(countryCode) {
  const options = {
    method: 'GET',
    url: 'https://shazam-core.p.rapidapi.com/v1/charts/country',
    params: { country_code: countryCode },
    headers: {
      'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com'
    }
  };

  const res = await axios.request(options);
  return res.data;
}

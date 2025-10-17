import axios from 'axios';

const API_KEY = '52783662-08dd67e4a79565a2d6e8bbcbe';
const BASE_URL = 'https://pixabay.com/api/';

export function getImagesByQuery(query) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40, 
  };

  // return promise: unswer axios.then -> response.data
  return axios
    .get(BASE_URL, { params })
    .then(response => response.data); 
}
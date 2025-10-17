import { getImagesByQuery } from './js/pixabay-api.js';
import { createGallery, clearGallery, showLoader, hideLoader } from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// selectors
const form = document.querySelector('.form');
const input = form.querySelector('input[name="search-text"]');

form.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();

  const query = input.value.trim();

  // checking
  if (!query) {
    iziToast.error({
      title: 'Warning',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

  // starting a search
  showLoader();
  clearGallery();
   
  // claer a field
    form.reset();

  getImagesByQuery(query)
    .then(data => {
      // hits — array of images
      const images = data.hits;

      if (!Array.isArray(images) || images.length === 0) {
        iziToast.error({
          title: '',
          message: 'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
        return;
      }

      // create a gallery if we have a result
      createGallery(images);

      iziToast.success({
        title: '',
        message: `Found ${data.totalHits ?? images.length} images.`,
        position: 'topRight',
      });
    })
    .catch(error => {
      // query error handling
      console.error('Pixabay API error:', error);
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong while fetching images. Please try again later.',
        position: 'topRight',
      });
    })
    .finally(() => {
      // Hide the loader
      hideLoader();
    });
}
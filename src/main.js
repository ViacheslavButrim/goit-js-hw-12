import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  getCardHeight,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const input = form.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(event) {
  event.preventDefault();
  const query = input.value.trim();

  if (!query) {
    iziToast.error({ title: 'Warning', message: 'Please enter a search query.', position: 'topRight' });
    return;
  }

  // new search
  currentQuery = query;
  currentPage = 1;
  totalHits = 0;

  hideLoadMoreButton();
  clearGallery();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    const images = data.hits || [];
    totalHits = data.totalHits || 0;

    if (!images.length) {
      iziToast.error({
        title: '',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(images);
    iziToast.success({ title: '', message: `Found ${totalHits} images.`, position: 'topRight' });

    // button Load more
    if (currentPage * PER_PAGE < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({ title: '', message: "We're sorry, but you've reached the end of search results.", position: 'topRight' });
    }

    form.reset();
  } catch (err) {
    console.error(err);
    iziToast.error({ title: '', message: 'Something went wrong. Try again later.', position: 'topRight' });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  if (!currentQuery) return;

  currentPage += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    const images = data.hits || [];

    if (!images.length) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      return;
    }

    // add new cards
    createGallery(images);

    // waiting for all the new pictures to load
    const newImages = document.querySelectorAll('.gallery__item img');
    const loadPromises = Array.from(newImages)
      .filter(img => !img.complete)
      .map(img => new Promise(resolve => {
        img.onload = img.onerror = resolve;
      }));
    await Promise.all(loadPromises);

    // get the height of the first card
    const firstCard = document.querySelector('.gallery__item');
    if (firstCard) {
const cardHeight = document.querySelector('.gallery').firstElementChild.offsetHeight;

      // scroll two card heights
      window.scrollBy({
        top: cardHeight * 3,
        behavior: 'smooth',
      });
    }

    // button control Load More
    if (currentPage * PER_PAGE >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }

  } catch (err) {
    console.error(err);
    currentPage = Math.max(1, currentPage - 1);
    iziToast.error({
      message: 'Failed to load more images. Try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

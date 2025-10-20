import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// selectors
const GALLERY_SELECTOR = '.gallery';
const LOADER_BACKDROP_SELECTOR = '.loader-backdrop';
const LOAD_MORE_WRAPPER_SELECTOR = '.load-more-wrapper';

const galleryEl = document.querySelector(GALLERY_SELECTOR);
const loaderBackdropEl = document.querySelector(LOADER_BACKDROP_SELECTOR);
const wrapperEl = document.querySelector(LOAD_MORE_WRAPPER_SELECTOR);

// init SimpleLightbox
export const lightbox = new SimpleLightbox(`${GALLERY_SELECTOR} a`, {
  captionsData: 'alt',
  captionDelay: 250,
});

// create and add markup in gallery
export function createGallery(images) {
  if (!galleryEl || !Array.isArray(images) || images.length === 0) return;

  const markup = images
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;

      return `
        <li class="gallery__item">
          <a class="gallery__link" href="${largeImageURL}">
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info__item"><b>Likes</b><span>${likes}</span></p>
              <p class="info__item"><b>Views</b><span>${views}</span></p>
              <p class="info__item"><b>Comments</b><span>${comments}</span></p>
              <p class="info__item"><b>Downloads</b><span>${downloads}</span></p>
            </div>
          </a>
        </li>
      `;
    })
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

// clear gallery
export function clearGallery() {
  if (!galleryEl) return;
  galleryEl.innerHTML = '';
  lightbox.refresh();
}

// loader control
export function showLoader() {
  if (!loaderBackdropEl) return;
  loaderBackdropEl.classList.add('is-active');
}

export function hideLoader() {
  if (!loaderBackdropEl) return;
  loaderBackdropEl.classList.remove('is-active');
}

// load more button (dynamic creation/removal)
export function showLoadMoreButton(onClick) {
  if (document.querySelector('.load-more')) return; // already exists

  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('load-more');
  button.textContent = 'Load more';

  wrapperEl.appendChild(button);
  button.addEventListener('click', onClick);
}

export function hideLoadMoreButton() {
  const btn = document.querySelector('.load-more');
  if (btn) btn.remove();
}

// for scroll: height of first card
export function getCardHeight() {
  if (!galleryEl) return 0;
  const firstItem = galleryEl.querySelector('.gallery__item');
  if (!firstItem) return 0;
  return firstItem.getBoundingClientRect().height;
}
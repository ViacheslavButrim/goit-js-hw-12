import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const GALLERY_SELECTOR = '.gallery';
const LOADER_SELECTOR = '.loader';

const galleryEl = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader');

// initial SimpleLightbox 
export const lightbox = new SimpleLightbox(`${GALLERY_SELECTOR} a`, {
  captionsData: 'alt',
  captionDelay: 250,
});

// create and add murkup of gallery 
export function createGallery(images) {
  if (!galleryEl) return;

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

  // add new elements in DOM 
  galleryEl.insertAdjacentHTML('beforeend', markup);

  // update SimpleLightbox
  lightbox.refresh();
}

// clear container contents 
export function clearGallery() {
  if (!galleryEl) return;
  galleryEl.innerHTML = '';
  // update lightbox after clearing
  lightbox.refresh();
}

const loaderBackdrop = document.querySelector('.loader-backdrop');

export function showLoader() {
  if (!loaderBackdrop) return;
  loaderBackdrop.classList.add('is-active');
}

export function hideLoader() {
  if (!loaderBackdrop) return;
  loaderBackdrop.classList.remove('is-active');
}
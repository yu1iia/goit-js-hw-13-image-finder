import imageCard from '../templates/imageCard.hbs';
import ApiService from './apiService';
import * as basicLightbox from 'basiclightbox';
import { alert, defaultModules } from '@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import { defaults } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import { Stack } from '@pnotify/core';

defaults.styling = 'brighttheme';
defaults.icons = 'brighttheme';

defaultModules.set(PNotifyMobile, {});

const galleryContainerRef = document.querySelector(`.gallery`);
const searchFormRef = document.querySelector('.search-form');
const anchorRef = document.querySelector('.anchor');

const newApiServise = new ApiService();

const observer = new IntersectionObserver(observerCallback, {
  rootMargin: '0px',
  threshold: 0,
});

const instance = basicLightbox.create(`
	<img class="modal-img" src="" alt="" />
`);

observer.observe(anchorRef);
searchFormRef.addEventListener('submit', onSearch);
galleryContainerRef.addEventListener('click', onOpenModal);

function onSearch(event) {
  event.preventDefault();
  newApiServise.query = event.currentTarget.elements.query.value;
  galleryContainerRef.innerHTML = '';
  newApiServise.resetPage();
  onFetchingImg();
}

function onFetchingImg() {
  newApiServise.fetchImages().then(images => {
    if (images.length === 0) {
      alert({
        text: 'No matches found! Try again',
        type: 'error',
        delay: 4000,
        stack: new Stack({
          dir1: 'up',
        }),
      });
    }
    galleryContainerRef.insertAdjacentHTML('beforeend', imageCard(images));
  });
}

function observerCallback([entrie]) {
  if (galleryContainerRef.innerHTML !== '' && entrie.isIntersecting) {
    onFetchingImg();
  }
}

function onOpenModal(event) {
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  instance.show();
  const modalImgRef = document.querySelector('.modal-img');

  modalImgRef.src = event.target.dataset.source;
  modalImgRef.alt = event.target.alt;
}

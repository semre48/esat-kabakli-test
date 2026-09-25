const siteContent = window.ESAT_SITE_CONTENT || { albums: [], gallery: [] };

const iconSvg = {
  appleMusic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6.8l9-2.2v10.2"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="15.5" cy="15" r="2.5"/></svg>',
  spotify: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M7.6 9.6c3.7-1 7.8-.7 11 .8M8.4 12.7c3.1-.8 6.5-.5 9.2.7M9.1 15.6c2.4-.6 5-.4 7.2.6"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="4"/><path d="m10 9 5 3-5 3Z"/></svg>',
  deezer: '<svg class="brand-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.81 4.16v3.03H24V4.16h-5.19zM6.27 8.38v3.027h5.189V8.38h-5.19zm12.54 0v3.027H24V8.38h-5.19zM6.27 12.594v3.027h5.189v-3.027h-5.19zm6.271 0v3.027h5.19v-3.027h-5.19zm6.27 0v3.027H24v-3.027h-5.19zM0 16.81v3.029h5.19v-3.03H0zm6.27 0v3.029h5.189v-3.03h-5.19zm6.271 0v3.029h5.19v-3.03h-5.19zm6.27 0v3.029H24v-3.03h-5.19Z"/></svg>',
  amazonMusic: '<svg class="brand-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 0 1-10.951-.577 17.88 17.88 0 0 1-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 0 1-.526-.496l-.31-.347a9.391 9.391 0 0 1-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02z"/></svg>'
};

function setOptionalBackground(element, src) {
  if (!src) return;
  element.style.backgroundImage = `url("${String(src).replace(/"/g, '\\"')}")`;
  element.classList.add('has-image');
}

function createAlbumLink(label, url, icon) {
  const link = document.createElement('a');
  link.href = url || '#';
  link.setAttribute('aria-label', label);
  link.innerHTML = icon;

  if (url) {
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
  } else {
    link.dataset.placeholderLink = '';
  }

  return link;
}

function renderDiscography() {
  const grid = document.getElementById('discographyGrid');
  if (!grid) return;
  grid.replaceChildren();

  siteContent.albums.forEach((album, index) => {
    const card = document.createElement('article');
    card.className = 'album-card glass-subtle';

    const cover = document.createElement('div');
    cover.className = `album-cover cover-${(index % 6) + 1}`;
    setOptionalBackground(cover, album.cover);

    const coverLabel = document.createElement('span');
    coverLabel.textContent = `ALBÜM ${String(index + 1).padStart(2, '0')}`;
    cover.appendChild(coverLabel);

    const info = document.createElement('div');
    info.className = 'album-info';

    const title = document.createElement('h3');
    title.textContent = album.title || 'Albüm Adı';

    const year = document.createElement('time');
    year.textContent = album.year || '20XX';

    info.append(title, year);

    const links = document.createElement('div');
    links.className = 'album-links';
    links.setAttribute('aria-label', `${title.textContent} bağlantıları`);
    links.append(
      createAlbumLink('Apple Music', album.appleMusic, iconSvg.appleMusic),
      createAlbumLink('Spotify', album.spotify, iconSvg.spotify),
      createAlbumLink('YouTube', album.youtube, iconSvg.youtube),
      createAlbumLink('Deezer', album.deezer, iconSvg.deezer),
      createAlbumLink('Amazon Music', album.amazonMusic, iconSvg.amazonMusic)
    );

    card.append(cover, info, links);
    grid.appendChild(card);
  });
}

function getGalleryOrientation(width, height) {
  if (!width || !height) return 'unknown';
  const ratio = width / height;
  if (ratio > 1.06) return 'landscape';
  if (ratio < 0.94) return 'portrait';
  return 'square';
}

function applyGalleryPlaceholder(tile, index) {
  const placeholderTypes = ['portrait', 'square', 'landscape'];
  const type = placeholderTypes[index % placeholderTypes.length];
  tile.classList.add('is-placeholder', `gallery-placeholder-${type}`);
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.replaceChildren();

  siteContent.gallery.forEach((photo, index) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = `gallery-tile gallery-${(index % 8) + 1}`;
    tile.dataset.galleryIndex = index;
    tile.setAttribute('aria-label', photo.alt || `Galeri ${String(index + 1).padStart(2, '0')}`);

    if (photo.src) {
      const image = document.createElement('img');
      image.src = photo.src;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';

      image.addEventListener('load', () => {
        const orientation = getGalleryOrientation(image.naturalWidth, image.naturalHeight);
        tile.dataset.orientation = orientation;
        tile.classList.add(`is-${orientation}`);
      });

      image.addEventListener('error', () => {
        image.remove();
        applyGalleryPlaceholder(tile, index);
      });

      tile.appendChild(image);
    } else {
      applyGalleryPlaceholder(tile, index);
    }

    const label = document.createElement('span');
    label.textContent = `Galeri ${String(index + 1).padStart(2, '0')}`;
    tile.appendChild(label);
    grid.appendChild(tile);
  });
}

renderDiscography();
renderGallery();

const backgroundVideo = document.getElementById('backgroundVideo');
const mobileVideoQuery = window.matchMedia('(max-width: 720px)');
let activeVideoVariant = '';

function applyBackgroundVideo() {
  const variant = mobileVideoQuery.matches ? 'mobile' : 'desktop';
  if (variant === activeVideoVariant) return;

  activeVideoVariant = variant;
  const source = variant === 'mobile'
    ? backgroundVideo.dataset.mobileSrc
    : backgroundVideo.dataset.desktopSrc;

  backgroundVideo.src = source;
  backgroundVideo.load();
  backgroundVideo.play().catch(() => {
    // Muted autoplay is normally permitted. If a browser blocks it,
    // the dark CSS background remains visible until playback can start.
  });
}

applyBackgroundVideo();
mobileVideoQuery.addEventListener?.('change', applyBackgroundVideo);

const modal = document.getElementById('contentModal');
const modalPanel = modal.querySelector('.modal-panel');
const modalScroll = modal.querySelector('.modal-scroll');
const modalTitle = document.getElementById('modalTitle');
const panelTriggers = [...document.querySelectorAll('[data-panel]')];
const panelContents = [...document.querySelectorAll('[data-content]')];
const closeModalButtons = [...document.querySelectorAll('[data-close-modal]')];
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxLabel = document.getElementById('lightboxLabel');
const galleryTiles = [...document.querySelectorAll('[data-gallery-index]')];
const toast = document.getElementById('toast');

const panelTitles = {
  bio: 'Biyografi',
  discography: 'Diskografi',
  gallery: 'Galeri'
};

let lastFocusedElement = null;
let galleryIndex = 0;
let touchStartX = 0;
let toastTimer;

function openModal(panelName) {
  lastFocusedElement = document.activeElement;

  modal.dataset.panel = panelName;
  modal.classList.toggle('bio-mode', panelName === 'bio');

  panelContents.forEach((panel) => {
    panel.hidden = panel.dataset.content !== panelName;
  });
  modalTitle.textContent = panelTitles[panelName] || 'Esat Kabaklı';
  modalScroll.scrollTop = 0;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('is-open');
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => modalPanel.focus());
}

function closeModal() {
  if (!modal.classList.contains('is-open')) return;
  if (lightbox.classList.contains('is-open')) closeLightbox();
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  lastFocusedElement?.focus();
}

panelTriggers.forEach((button) => {
  button.addEventListener('click', () => openModal(button.dataset.panel));
});
closeModalButtons.forEach((button) => button.addEventListener('click', closeModal));

function updateLightbox() {
  const photo = siteContent.gallery[galleryIndex];
  if (!photo) return;

  lightboxImage.className = `lightbox-image gallery-${(galleryIndex % 8) + 1}`;
  lightboxImage.style.backgroundImage = '';
  setOptionalBackground(lightboxImage, photo.src);

  const displayLabel = `Galeri ${String(galleryIndex + 1).padStart(2, '0')}`;
  lightboxLabel.textContent = displayLabel;
  lightboxImage.setAttribute('aria-label', photo.alt || displayLabel);
}

function openLightbox(index) {
  if (!siteContent.gallery.length) return;
  galleryIndex = index;
  updateLightbox();
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
}

function stepGallery(direction) {
  if (!siteContent.gallery.length) return;
  galleryIndex = (galleryIndex + direction + siteContent.gallery.length) % siteContent.gallery.length;
  updateLightbox();
}

galleryTiles.forEach((tile) => {
  tile.addEventListener('click', () => openLightbox(Number(tile.dataset.galleryIndex)));
});

document.querySelectorAll('[data-close-lightbox]').forEach((button) => button.addEventListener('click', closeLightbox));
document.querySelector('[data-gallery-prev]').addEventListener('click', () => stepGallery(-1));
document.querySelector('[data-gallery-next]').addEventListener('click', () => stepGallery(1));

lightboxImage.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
lightboxImage.addEventListener('touchend', (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 45) stepGallery(delta > 0 ? -1 : 1);
}, { passive: true });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (lightbox.classList.contains('is-open')) closeLightbox();
    else closeModal();
  }
  if (lightbox.classList.contains('is-open') && event.key === 'ArrowLeft') stepGallery(-1);
  if (lightbox.classList.contains('is-open') && event.key === 'ArrowRight') stepGallery(1);
});

document.querySelectorAll('[data-placeholder-link]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    clearTimeout(toastTimer);
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  });
});

// Subtle pointer-following highlight for the liquid-glass surfaces.
document.querySelectorAll('.glass').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    element.style.setProperty('--mx', `${x}%`);
    element.style.setProperty('--my', `${y}%`);
  });
});

const contactModal = document.getElementById('contactModal');
const openContactButton = document.querySelector('[data-open-contact]');
const closeContactButtons = [
  ...document.querySelectorAll('[data-close-contact]')
];

function openContactModal() {
  contactModal.classList.add('is-open');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeContactModal() {
  contactModal.classList.remove('is-open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

openContactButton?.addEventListener('click', openContactModal);

closeContactButtons.forEach((button) => {
  button.addEventListener('click', closeContactModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && contactModal.classList.contains('is-open')) {
    closeContactModal();
  }
});
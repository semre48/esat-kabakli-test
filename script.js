const siteContent = window.ESAT_SITE_CONTENT || { albums: [], gallery: [] };

const iconSvg = {
  appleMusic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6.8l9-2.2v10.2"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="15.5" cy="15" r="2.5"/></svg>',
  spotify: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M7.6 9.6c3.7-1 7.8-.7 11 .8M8.4 12.7c3.1-.8 6.5-.5 9.2.7M9.1 15.6c2.4-.6 5-.4 7.2.6"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="4"/><path d="m10 9 5 3-5 3Z"/></svg>'
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
      createAlbumLink('YouTube', album.youtube, iconSvg.youtube)
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
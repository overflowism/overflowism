const data = window.galleryData;
const views = [...document.querySelectorAll('.view')];
const dialog = document.querySelector('#art-dialog');
const artworkContainer = document.querySelector('#artworks');
let lastFocused;

document.querySelector('#room').style.backgroundImage = `url("${data.roomImage}")`;
document.querySelector('#artist-bio').textContent = data.artist.bio;
document.querySelector('#artist-note').textContent = data.artist.placeholder ? data.artist.note : '';

function showView() {
  const name = location.hash.slice(1);
  const current = ['gallery', 'about'].includes(name) ? name : 'home';
  views.forEach(view => { view.hidden = view.id !== current; });
  document.querySelectorAll('nav a').forEach(link => {
    if (link.hash === `#${current}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (dialog.open) dialog.close();
  window.scrollTo(0, 0);
}

function openArtwork(artwork, index, trigger) {
  lastFocused = trigger;
  document.querySelector('#dialog-image').src = artwork.image;
  document.querySelector('#dialog-image').alt = artwork.alt;
  document.querySelector('#dialog-title').textContent = artwork.title;
  document.querySelector('#dialog-description').textContent = artwork.description;
  document.querySelector('#dialog-details').textContent = artwork.details;
  document.querySelector('#dialog-index').textContent = `${String(index + 1).padStart(2, '0')} / ${String(data.artworks.length).padStart(2, '0')}`;
  document.querySelector('#dialog-placeholder').hidden = !artwork.placeholder;
  document.querySelector('#inquiry-note').hidden = Boolean(data.contactEmail);
  document.querySelector('#inquiry').href = `mailto:${encodeURIComponent(data.contactEmail)}?subject=${encodeURIComponent(`Inquiry: ${artwork.title}`)}`;
  dialog.showModal();
}

data.artworks.forEach((artwork, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `artwork artwork--${index + 1}`;
  button.setAttribute('aria-label', `View ${artwork.title}${artwork.placeholder ? ', placeholder artwork' : ''}`);
  const image = document.createElement('img');
  image.src = artwork.image;
  image.alt = '';
  const label = document.createElement('span');
  label.className = 'artwork-label';
  label.textContent = artwork.placeholder ? 'PLACEHOLDER ARTWORK' : artwork.title;
  button.append(image, label);
  button.addEventListener('click', () => openArtwork(artwork, index, button));
  artworkContainer.append(button);
});

document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => { if (lastFocused && !lastFocused.closest('[hidden]')) lastFocused.focus(); });
window.addEventListener('hashchange', showView);
showView();

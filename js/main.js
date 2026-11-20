const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownList = document.querySelector('.dropdown-list');

function closeDropdown() {
  dropdownList.hidden = true;
  dropdownToggle.setAttribute('aria-expanded', 'false');
}
function closeNav() {
  navPanel.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
  closeDropdown();
}
navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navPanel.classList.toggle('is-open', !expanded);
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navToggle.setAttribute('aria-label', expanded ? 'Ouvrir le menu de navigation' : 'Fermer le menu de navigation');
});
dropdownToggle.addEventListener('click', () => {
  const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
  dropdownList.hidden = expanded;
  dropdownToggle.setAttribute('aria-expanded', String(!expanded));
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.dropdown')) closeDropdown();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNav();
});
navPanel.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search');
const cards = [...document.querySelectorAll('.product-card')];
const feedback = document.querySelector('#search-feedback');
const filterChips = [...document.querySelectorAll('.filter-chip')];
let selectedCategory = 'all';
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
function filterCollections() {
  const query = normalize(searchInput.value);
  let count = 0;
  cards.forEach(card => {
    const matched = (!query || normalize(card.dataset.search).includes(query)) && (selectedCategory === 'all' || card.dataset.category === selectedCategory);
    card.hidden = !matched;
    if (matched) count++;
  });
  feedback.textContent = !query && selectedCategory === 'all' ? '' : count === 0 ? 'Aucune collection trouvée. Essayez un autre filtre.' : `${count} collection${count > 1 ? 's' : ''} trouvée${count > 1 ? 's' : ''}.`;
}
searchInput.addEventListener('input', filterCollections);
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  filterCollections();
  closeNav();
  document.querySelector('#collections').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
});
document.querySelector('#year').textContent = new Date().getFullYear();


// Filtres accessibles, compatibles avec la recherche.
filterChips.forEach(chip => chip.addEventListener('click', () => {
  selectedCategory = chip.dataset.filter;
  filterChips.forEach(other => {
    const active = other === chip;
    other.classList.toggle('active', active);
    other.setAttribute('aria-pressed', String(active));
  });
  filterCollections();
}));

// Aperçu des collections : aucune bibliothèque JavaScript externe.
const products = {
  bagues: {title:'Bagues', kicker:'COLLECTION 01', image:'image/bague.png', alt:'Bague dorée avec une pierre brillante', description:'Des bagues délicates pour célébrer les moments qui comptent. Une sélection où la lumière rencontre la finesse des détails.'},
  colliers: {title:'Colliers', kicker:'COLLECTION 02', image:'image/collier.png', alt:'Collier doré au pendentif vert', description:'Des colliers élégants, choisis pour apporter éclat et personnalité à chaque tenue.'},
  bracelets: {title:'Bracelets', kicker:'COLLECTION 03', image:'image/bracelet.png', alt:'Bracelet doré avec des pierres brillantes', description:'Des bracelets intemporels qui accompagnent chaque geste avec discrétion et lumière.'}
};
const modal = document.querySelector('#product-modal');
const modalImage = document.querySelector('#modal-image');
const subjectInput = document.querySelector('#sujet');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let lastTrigger = null;
document.querySelectorAll('.open-detail').forEach(button => button.addEventListener('click', () => {
  const item = products[button.dataset.product];
  if (!item || !modal) return;
  lastTrigger = button;
  document.querySelector('#modal-title').textContent = item.title;
  document.querySelector('#modal-kicker').textContent = item.kicker;
  document.querySelector('#modal-description').textContent = item.description;
  modalImage.src = item.image;
  modalImage.alt = item.alt;
  document.querySelector('#modal-contact').dataset.category = item.title;
  modal.showModal();
}));
modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
modal.addEventListener('close', () => { if (lastTrigger) lastTrigger.focus(); });
document.querySelector('#modal-contact').addEventListener('click', event => {
  subjectInput.value = `Informations sur la collection ${event.currentTarget.dataset.category}`;
  modal.close();
  setTimeout(() => subjectInput.focus({preventScroll:true}), 0);
});

// Lien Retour en haut seulement lorsqu'il est utile.
const toTop = document.querySelector('.back-to-top');
function updateScrollState() {
  toTop.classList.toggle('visible', window.scrollY > 520);
  document.querySelector('.site-header').classList.toggle('scrolled', window.scrollY > 20);
}
window.addEventListener('scroll', updateScrollState, {passive:true});
updateScrollState();

// Mettre automatiquement la collection sélectionnée dans le sujet du formulaire.
document.querySelectorAll('.dropdown-list a').forEach(link => link.addEventListener('click', () => {
  const label = link.textContent.trim();
  const chip = filterChips.find(item => item.textContent.trim().toLowerCase() === label.toLowerCase());
  if (chip) chip.click();
}));

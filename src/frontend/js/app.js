import { loadPartials } from './components/loader.js';
import { modal } from './components/forms/modal.js';
import { loadLegislators, initLegislatorsView } from './views/legislators.js';
import { loadLegislation, initLegislationView } from './views/legislation.js';

await loadPartials();

modal.init();
initLegislatorsView();
initLegislationView();

const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');

function showView(viewId) {
  views.forEach(v => v.classList.remove('active'));
  navBtns.forEach(b => b.classList.remove('active'));
  document.getElementById(`view-${viewId}`).classList.add('active');
  document.querySelector(`[data-view="${viewId}"]`).classList.add('active');
}

const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.nav-hamburger');

hamburger.addEventListener('click', () => navbar.classList.toggle('open'));

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navbar.classList.remove('open');
    const view = btn.dataset.view;
    showView(view);
    if (view === 'legislators') loadLegislators();
    if (view === 'legislation') loadLegislation();
  });
});

loadLegislators();

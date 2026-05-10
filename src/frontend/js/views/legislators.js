import api from '../utilities/api.js';
import { escHtml } from '../utilities/utils.js';
import { PAGE_SIZE, getPageSlice, renderPagination } from '../utilities/pagination.js';
import { openLegislatorForm } from '../components/forms/legislatorForm.js';
import { openDeleteConfirm } from '../components/forms/deleteConfirm.js';
import { modal } from '../components/forms/modal.js';

let _legislatorsData = [];
let _sortCol = null;
let _sortDir = 'asc';
let _page = 1;

export async function loadLegislators() {
  const tbody = document.getElementById('tbody-legislators');
  tbody.innerHTML = '<tr class="placeholder-row"><td colspan="4"><div class="spinner"></div></td></tr>';
  try {
    const legislators = await api.getLegislators();
    _legislatorsData = legislators;
    applyAndRender();
  } catch {
    tbody.innerHTML = `<tr class="error-row"><td colspan="4">Could not load legislators. Is the server running?</td></tr>`;
  }
}

function applyAndRender() {
  const query = (document.getElementById('search-legislators')?.value || '').toLowerCase();
  let data = _legislatorsData;

  if (query) {
    data = data.filter(l =>
      `${l.first_name} ${l.last_name} ${l.hometown}`.toLowerCase().includes(query)
    );
  }

  if (_sortCol) {
    data = [...data].sort((a, b) => {
      const av = (a[_sortCol] || '').toLowerCase();
      const bv = (b[_sortCol] || '').toLowerCase();
      return _sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  _page = Math.min(_page, totalPages || 1);

  renderLegislatorsTable(getPageSlice(data, _page));
  updateSortHeaders('table-legislators');
  renderPagination('pagination-legislators', _page, totalPages, p => { _page = p; applyAndRender(); });
}

function renderLegislatorsTable(legislators) {
  const tbody = document.getElementById('tbody-legislators');
  if (!legislators.length) {
    const msg = _legislatorsData.length
      ? 'No results match your search.'
      : 'No legislators yet. Add one to get started.';
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">${msg}</td></tr>`;
    return;
  }
  tbody.innerHTML = legislators.map(l => `
    <tr data-id="${l.id}">
      <td>${escHtml(l.first_name)}</td>
      <td>${escHtml(l.last_name)}</td>
      <td>${escHtml(l.hometown)}</td>
      <td class="actions-cell">
        <button class="btn btn-sm btn-secondary btn-icon btn-sponsored" title="Sponsored Bills" aria-label="Sponsored Bills">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <line x1="10" y1="9" x2="8" y2="9"/>
          </svg>
        </button>
        <button class="btn btn-sm btn-secondary btn-edit">Edit</button>
        <button class="btn btn-sm btn-danger btn-delete">Delete</button>
      </td>
    </tr>
  `).join('');
}

function updateSortHeaders(tableId) {
  document.querySelectorAll(`#${tableId} th[data-col]`).forEach(th => {
    th.classList.remove('th-sort-asc', 'th-sort-desc');
    if (th.dataset.col === _sortCol) {
      th.classList.add(_sortDir === 'asc' ? 'th-sort-asc' : 'th-sort-desc');
    }
  });
}

async function openSponsoredBillsModal(legislator) {
  const container = document.createElement('div');
  container.className = 'sponsored-bills-list';
  container.innerHTML = '<div class="spinner"></div>';
  modal.open(`${legislator.first_name} ${legislator.last_name} — Sponsored Bills`, container);

  try {
    const bills = await api.getLegislationByLegislator(legislator.id);
    if (!bills.length) {
      container.innerHTML = '<p class="empty-message">No sponsored legislation found.</p>';
      return;
    }
    container.innerHTML = `
      <ul class="sponsored-bills-items">
        ${bills.map(b => `<li>${escHtml(b.title)}</li>`).join('')}
      </ul>
    `;
  } catch (err) {
    container.innerHTML = `<p class="error-message">${escHtml(err.message)}</p>`;
  }
}

export function initLegislatorsView() {
  document.getElementById('btn-new-legislator').addEventListener('click', () => {
    openLegislatorForm(loadLegislators);
  });

  document.getElementById('search-legislators').addEventListener('input', () => { _page = 1; applyAndRender(); });

  document.getElementById('table-legislators').querySelector('thead').addEventListener('click', e => {
    const th = e.target.closest('th[data-col]');
    if (!th) return;
    const col = th.dataset.col;
    if (_sortCol === col) {
      _sortDir = _sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      _sortCol = col;
      _sortDir = 'asc';
    }
    _page = 1;
    applyAndRender();
  });

  document.getElementById('tbody-legislators').addEventListener('click', async e => {
    const btn = e.target.closest('.btn-edit, .btn-delete, .btn-sponsored');
    if (!btn) return;
    const row = btn.closest('tr[data-id]');
    if (!row) return;
    const id = row.dataset.id;
    const legislator = _legislatorsData.find(l => l.id === id);
    if (!legislator) return;

    if (btn.classList.contains('btn-sponsored')) {
      openSponsoredBillsModal(legislator);
    } else if (btn.classList.contains('btn-edit')) {
      openLegislatorForm(loadLegislators, legislator);
    } else {
      openDeleteConfirm(`${legislator.first_name} ${legislator.last_name}`, async () => {
        await api.deleteLegislator(id);
        loadLegislators();
      });
    }
  });
}

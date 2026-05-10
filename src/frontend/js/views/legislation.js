import api from '../utilities/api.js';
import { escHtml } from '../utilities/utils.js';
import { openLegislationForm } from '../components/forms/legislationForm.js';

let _legislationData = [];
let _sortCol = null;
let _sortDir = 'asc';

export async function loadLegislation() {
  const tbody = document.getElementById('tbody-legislation');
  tbody.innerHTML = '<tr class="placeholder-row"><td colspan="4"><div class="spinner"></div></td></tr>';
  try {
    const legislation = await api.getLegislation();
    _legislationData = legislation;
    applyAndRender();
  } catch (e) {
    tbody.innerHTML = `<tr class="error-row"><td colspan="4">Could not load legislation. Is the server running?</td></tr>`;
  }
}

function applyAndRender() {
  const query = (document.getElementById('search-legislation')?.value || '').toLowerCase();
  let data = _legislationData;

  if (query) {
    data = data.filter(l => {
      const sponsorNames = (l.sponsors || []).map(s => `${s.first_name} ${s.last_name}`).join(' ');
      return `${l.title} ${l.text} ${sponsorNames}`.toLowerCase().includes(query);
    });
  }

  if (_sortCol) {
    data = [...data].sort((a, b) => {
      const av = (a[_sortCol] || '').toLowerCase();
      const bv = (b[_sortCol] || '').toLowerCase();
      return _sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }

  renderLegislationTable(data);
  updateSortHeaders('table-legislation');
}

function renderLegislationTable(legislation) {
  const tbody = document.getElementById('tbody-legislation');
  if (!legislation.length) {
    const msg = _legislationData.length
      ? 'No results match your search.'
      : 'No legislation yet. Add one to get started.';
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">${msg}</td></tr>`;
    return;
  }
  tbody.innerHTML = legislation.map(l => {
    const sponsors = formatSponsors(l.sponsors || []);
    return `
      <tr data-id="${l.id}">
        <td>${escHtml(l.title)}</td>
        <td class="text-cell"><div class="text-cell-inner" title="${escHtml(l.text)}">${escHtml(l.text)}</div></td>
        <td class="sponsors-cell">${sponsors || '<span style="color:#94a3b8">None</span>'}</td>
        <td class="actions-cell">
          <button class="btn btn-sm btn-secondary btn-edit">Edit</button>
          <button class="btn btn-sm btn-danger btn-delete">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function formatSponsors(sponsors) {
  const names = sponsors.map(s => escHtml(`${s.first_name} ${s.last_name}`));
  if (names.length < 4) return names.join(', ');
  return `${names[0]} et al <span class="sponsor-count">(${names.length})</span><span class="sponsor-info" data-sponsors="${names.join('|')}">i</span>`;
}

function updateSortHeaders(tableId) {
  document.querySelectorAll(`#${tableId} th[data-col]`).forEach(th => {
    th.classList.remove('th-sort-asc', 'th-sort-desc');
    if (th.dataset.col === _sortCol) {
      th.classList.add(_sortDir === 'asc' ? 'th-sort-asc' : 'th-sort-desc');
    }
  });
}

export function initLegislationView() {
  document.getElementById('btn-new-legislation').addEventListener('click', () => {
    openLegislationForm(loadLegislation);
  });

  document.getElementById('search-legislation').addEventListener('input', applyAndRender);

  document.getElementById('table-legislation').querySelector('thead').addEventListener('click', e => {
    const th = e.target.closest('th[data-col]');
    if (!th) return;
    const col = th.dataset.col;
    if (_sortCol === col) {
      _sortDir = _sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      _sortCol = col;
      _sortDir = 'asc';
    }
    applyAndRender();
  });

  const tooltip = document.createElement('div');
  tooltip.className = 'sponsor-tooltip';
  document.body.appendChild(tooltip);

  document.getElementById('tbody-legislation').addEventListener('mouseover', e => {
    const info = e.target.closest('.sponsor-info');
    if (!info) return;
    const names = info.dataset.sponsors.split('|');
    tooltip.innerHTML = `<ul>${names.map(n => `<li>${n}</li>`).join('')}</ul>`;
    const rect = info.getBoundingClientRect();
    tooltip.classList.add('visible');
    const tw = tooltip.offsetWidth;
    const th = tooltip.offsetHeight;
    const top = rect.top >= th + 6 ? rect.top - th - 6 : rect.bottom + 6;
    const left = Math.max(8, Math.min(rect.left + rect.width / 2 - tw / 2, window.innerWidth - tw - 8));
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  });

  document.getElementById('tbody-legislation').addEventListener('mouseout', e => {
    if (!e.target.closest('.sponsor-info')) return;
    tooltip.classList.remove('visible');
  });

  document.getElementById('tbody-legislation').addEventListener('click', async e => {
    const btn = e.target.closest('.btn-edit, .btn-delete');
    if (!btn) return;
    const row = btn.closest('tr[data-id]');
    if (!row) return;
    const id = row.dataset.id;
    const legislation = _legislationData.find(l => l.id === id);
    if (!legislation) return;

    if (btn.classList.contains('btn-edit')) {
      openLegislationForm(loadLegislation, legislation);
    } else {
      if (!confirm(`Delete "${legislation.title}"?`)) return;
      try {
        await api.deleteLegislation(id);
        loadLegislation();
      } catch (err) {
        alert(err.message);
      }
    }
  });
}

import api from '../api.js';
import { escHtml } from '../utilities/utils.js';
import { openLegislatorForm } from '../components/forms/legislator-form.js';

let _legislatorsData = [];

export async function loadLegislators() {
  const tbody = document.getElementById('tbody-legislators');
  tbody.innerHTML = '<tr class="placeholder-row"><td colspan="4"><div class="spinner"></div></td></tr>';
  try {
    const legislators = await api.getLegislators();
    renderLegislatorsTable(legislators);
  } catch (e) {
    tbody.innerHTML = `<tr class="error-row"><td colspan="4">Could not load legislators. Is the server running?</td></tr>`;
  }
}

function renderLegislatorsTable(legislators) {
  _legislatorsData = legislators;
  const tbody = document.getElementById('tbody-legislators');
  if (!legislators.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="4">No legislators yet. Add one to get started.</td></tr>';
    return;
  }
  tbody.innerHTML = legislators.map(l => `
    <tr data-id="${l.id}">
      <td>${escHtml(l.first_name)}</td>
      <td>${escHtml(l.last_name)}</td>
      <td>${escHtml(l.hometown)}</td>
      <td class="actions-cell">
        <button class="btn btn-sm btn-secondary btn-edit">Edit</button>
        <button class="btn btn-sm btn-danger btn-delete">Delete</button>
      </td>
    </tr>
  `).join('');
}

export function initLegislatorsView() {
  document.getElementById('btn-new-legislator').addEventListener('click', () => {
    openLegislatorForm(loadLegislators);
  });

  document.getElementById('tbody-legislators').addEventListener('click', async e => {
    const btn = e.target.closest('.btn-edit, .btn-delete');
    if (!btn) return;
    const row = btn.closest('tr[data-id]');
    if (!row) return;
    const id = row.dataset.id;
    const legislator = _legislatorsData.find(l => l.id === id);
    if (!legislator) return;

    if (btn.classList.contains('btn-edit')) {
      openLegislatorForm(loadLegislators, legislator);
    } else {
      if (!confirm(`Delete ${legislator.first_name} ${legislator.last_name}?`)) return;
      try {
        await api.deleteLegislator(id);
        loadLegislators();
      } catch (err) {
        alert(err.message);
      }
    }
  });
}

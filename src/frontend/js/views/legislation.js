import api from '../utilities/api.js';
import { escHtml } from '../utilities/utils.js';
import { openLegislationForm } from '../components/forms/legislationForm.js';

let _legislationData = [];

export async function loadLegislation() {
  const tbody = document.getElementById('tbody-legislation');
  tbody.innerHTML = '<tr class="placeholder-row"><td colspan="4"><div class="spinner"></div></td></tr>';
  try {
    const legislation = await api.getLegislation();
    renderLegislationTable(legislation);
  } catch (e) {
    tbody.innerHTML = `<tr class="error-row"><td colspan="4">Could not load legislation. Is the server running?</td></tr>`;
  }
}

function renderLegislationTable(legislation) {
  _legislationData = legislation;
  const tbody = document.getElementById('tbody-legislation');
  if (!legislation.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="4">No legislation yet. Add one to get started.</td></tr>';
    return;
  }
  tbody.innerHTML = legislation.map(l => {
    const sponsors = formatSponsors(l.sponsors || []);
    return `
      <tr data-id="${l.id}">
        <td>${escHtml(l.title)}</td>
        <td class="text-cell" title="${escHtml(l.text)}">${escHtml(l.text)}</td>
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
  return sponsors.map(s => escHtml(`${s.first_name} ${s.last_name}`)).join(', ');
}

export function initLegislationView() {
  document.getElementById('btn-new-legislation').addEventListener('click', () => {
    openLegislationForm(loadLegislation);
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

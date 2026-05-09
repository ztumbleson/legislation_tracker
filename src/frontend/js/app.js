// ── Init (runs after all HTML partials are injected) ─────────
document.addEventListener('app:ready', () => {
  const navBtns = document.querySelectorAll('.nav-btn');
  const views = document.querySelectorAll('.view');

  function showView(viewId) {
    views.forEach(v => v.classList.remove('active'));
    navBtns.forEach(b => b.classList.remove('active'));
    document.getElementById(`view-${viewId}`).classList.add('active');
    document.querySelector(`[data-view="${viewId}"]`).classList.add('active');
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      showView(view);
      if (view === 'legislators') loadLegislators();
      if (view === 'legislation') loadLegislation();
    });
  });

  modal.init();
  loadLegislators();

  document.getElementById('btn-new-legislator').addEventListener('click', () => {
    openLegislatorForm(loadLegislators);
  });

  document.getElementById('btn-new-legislation').addEventListener('click', () => {
    openLegislationForm(loadLegislation);
  });
});

// ── Legislators table ────────────────────────────────────────
async function loadLegislators() {
  const tbody = document.getElementById('tbody-legislators');
  tbody.innerHTML = '<tr class="placeholder-row"><td colspan="3"><div class="spinner"></div></td></tr>';
  try {
    const legislators = await api.getLegislators();
    renderLegislatorsTable(legislators);
  } catch (e) {
    tbody.innerHTML = `<tr class="error-row"><td colspan="3">Could not load legislators. Is the server running?</td></tr>`;
  }
}

function renderLegislatorsTable(legislators) {
  const tbody = document.getElementById('tbody-legislators');
  if (!legislators.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="3">No legislators yet. Add one to get started.</td></tr>';
    return;
  }
  tbody.innerHTML = legislators.map(l => `
    <tr>
      <td>${escHtml(l.first_name)}</td>
      <td>${escHtml(l.last_name)}</td>
      <td>${escHtml(l.hometown)}</td>
    </tr>
  `).join('');
}

// ── Legislation table ────────────────────────────────────────
async function loadLegislation() {
  const tbody = document.getElementById('tbody-legislation');
  tbody.innerHTML = '<tr class="placeholder-row"><td colspan="3"><div class="spinner"></div></td></tr>';
  try {
    const legislation = await api.getLegislation();
    renderLegislationTable(legislation);
  } catch (e) {
    tbody.innerHTML = `<tr class="error-row"><td colspan="3">Could not load legislation. Is the server running?</td></tr>`;
  }
}

function renderLegislationTable(legislation) {
  const tbody = document.getElementById('tbody-legislation');
  if (!legislation.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="3">No legislation yet. Add one to get started.</td></tr>';
    return;
  }
  tbody.innerHTML = legislation.map(l => {
    const sponsors = formatSponsors(l.sponsors || []);
    return `
      <tr>
        <td>${escHtml(l.title)}</td>
        <td class="text-cell" title="${escHtml(l.text)}">${escHtml(l.text)}</td>
        <td class="sponsors-cell">${sponsors || '<span style="color:#94a3b8">None</span>'}</td>
      </tr>
    `;
  }).join('');
}

function formatSponsors(sponsors) {
  return sponsors.map(s => escHtml(`${s.first_name} ${s.last_name}`)).join(', ');
}

// ── Utilities ────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


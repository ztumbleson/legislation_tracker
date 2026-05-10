export const modal = (() => {
  let activeSponsorSelect = null;

  function init() {
    document.getElementById('btn-modal-close').addEventListener('click', close);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
  }

  function open(title, formEl) {
    document.getElementById('modal-title').textContent = title;
    const body = document.getElementById('modal-body');
    body.innerHTML = '';
    body.appendChild(formEl);
    document.getElementById('modal-overlay').classList.remove('hidden');
  }

  function close() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-body').innerHTML = '';
    if (activeSponsorSelect) {
      activeSponsorSelect.destroy();
      activeSponsorSelect = null;
    }
  }

  function setSponsorSelect(s) {
    activeSponsorSelect = s;
  }

  return { init, open, close, setSponsorSelect };
})();

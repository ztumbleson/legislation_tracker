import { modal } from './modal.js';
import { escHtml } from '../../utilities/utils.js';

export function openDeleteConfirm(name, onConfirm) {
  const el = document.createElement('div');
  el.className = 'delete-confirm';

  const msg = document.createElement('p');
  msg.className = 'delete-confirm-message';
  msg.innerHTML = `Delete <strong>${escHtml(name)}</strong>?`;

  const sub = document.createElement('p');
  sub.className = 'delete-confirm-sub';
  sub.textContent = 'This cannot be undone.';

  const actions = document.createElement('div');
  actions.className = 'form-actions';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn-secondary';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', () => modal.close());

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn-danger';
  deleteBtn.textContent = 'Delete';

  deleteBtn.addEventListener('click', async () => {
    deleteBtn.disabled = true;
    deleteBtn.textContent = 'Deleting…';
    cancelBtn.disabled = true;
    try {
      await onConfirm();
      modal.close();
    } catch (err) {
      deleteBtn.disabled = false;
      deleteBtn.textContent = 'Delete';
      cancelBtn.disabled = false;
      let banner = el.querySelector('.form-error-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.className = 'form-error-banner';
        el.prepend(banner);
      }
      banner.textContent = err.message;
    }
  });

  actions.appendChild(cancelBtn);
  actions.appendChild(deleteBtn);
  el.appendChild(msg);
  el.appendChild(sub);
  el.appendChild(actions);

  modal.open('Confirm Delete', el);
}

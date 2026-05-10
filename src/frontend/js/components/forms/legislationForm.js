import api from '../../utilities/api.js';
import { createTextField } from '../textField.js';
import { createLongAnswer } from '../longAnswer.js';
import { createSponsorSelect } from '../sponsorSelect.js';
import { modal } from './modal.js';
import { setFieldError, clearFieldError, setFormError } from './formUtils.js';

export async function openLegislationForm(onSuccess, existing = null) {
  const form = document.createElement('form');
  form.noValidate = true;

  const title = createTextField({ id: 'lf-title', label: 'Title', required: true, placeholder: 'Clean Air Act 2026' });
  const text  = createLongAnswer({ id: 'lf-text',  label: 'Text',  required: true, placeholder: 'The full text of the legislation...' });

  if (existing) {
    title.input.value = existing.title;
    text.input.value  = existing.text;
  }

  let legislators = [];
  try { legislators = await api.getLegislators(); } catch (_) {}

  const selectedIds = existing ? (existing.sponsors || []).map(s => s.id) : [];
  const sponsors = createSponsorSelect({ label: 'Sponsors', legislators, selectedIds });
  modal.setSponsorSelect(sponsors);

  const actions = document.createElement('div');
  actions.className = 'form-actions';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-primary';
  submitBtn.textContent = existing ? 'Save Changes' : 'Add Legislation';
  actions.appendChild(submitBtn);

  form.appendChild(title.el);
  form.appendChild(text.el);
  form.appendChild(sponsors.el);
  form.appendChild(actions);

  [title, text].forEach(({ el, input }) => {
    input.addEventListener('input', () => clearFieldError(el));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const fields = [
      { field: title, input: title.input },
      { field: text,  input: text.input },
    ];

    let valid = true;
    fields.forEach(({ field, input }) => {
      if (!input.value.trim()) {
        setFieldError(field.el, 'This field is required');
        valid = false;
      } else {
        clearFieldError(field.el);
      }
    });
    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    const data = {
      title:       title.input.value.trim(),
      text:        text.input.value.trim(),
      sponsor_ids: sponsors.getSelected(),
    };

    try {
      if (existing) {
        await api.updateLegislation(existing.id, data);
      } else {
        await api.createLegislation(data);
      }
      modal.close();
      onSuccess();
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = existing ? 'Save Changes' : 'Add Legislation';
      setFormError(form, err.message);
    }
  });

  modal.open(existing ? 'Edit Legislation' : 'New Legislation', form);
}

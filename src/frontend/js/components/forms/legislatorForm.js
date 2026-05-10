import api from '../../utilities/api.js';
import { createTextField } from '../textField.js';
import { modal } from './modal.js';
import { setFieldError, clearFieldError, setFormError } from './formUtils.js';

export function openLegislatorForm(onSuccess, existing = null) {
  const form = document.createElement('form');
  form.noValidate = true;

  const firstName = createTextField({ id: 'lf-first-name', label: 'First Name', required: true, placeholder: 'Jane' });
  const lastName  = createTextField({ id: 'lf-last-name',  label: 'Last Name',  required: true, placeholder: 'Doe' });
  const hometown  = createTextField({ id: 'lf-hometown',   label: 'Hometown',   required: true, placeholder: 'Springfield' });

  if (existing) {
    firstName.input.value = existing.first_name;
    lastName.input.value  = existing.last_name;
    hometown.input.value  = existing.hometown;
  }

  const actions = document.createElement('div');
  actions.className = 'form-actions';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-primary';
  submitBtn.textContent = existing ? 'Save Changes' : 'Add Legislator';
  actions.appendChild(submitBtn);

  form.appendChild(firstName.el);
  form.appendChild(lastName.el);
  form.appendChild(hometown.el);
  form.appendChild(actions);

  [firstName, lastName, hometown].forEach(({ el, input }) => {
    input.addEventListener('input', () => clearFieldError(el));
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const fields = [
      { field: firstName, input: firstName.input },
      { field: lastName,  input: lastName.input },
      { field: hometown,  input: hometown.input },
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
      first_name: firstName.input.value.trim(),
      last_name:  lastName.input.value.trim(),
      hometown:   hometown.input.value.trim(),
    };

    try {
      if (existing) {
        await api.updateLegislator(existing.id, data);
      } else {
        await api.createLegislator(data);
      }
      modal.close();
      onSuccess();
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = existing ? 'Save Changes' : 'Add Legislator';
      setFormError(form, err.message);
    }
  });

  modal.open(existing ? 'Edit Legislator' : 'New Legislator', form);
}

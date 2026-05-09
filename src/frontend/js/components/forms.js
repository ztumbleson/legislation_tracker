// ── Modal ────────────────────────────────────────────────────
const modal = (() => {
  let activeSponsorSelect = null;

  function init() {
    document.getElementById('btn-modal-close').addEventListener('click', close);
    document.getElementById('modal-overlay').addEventListener('click', e => {
      if (e.target === document.getElementById('modal-overlay')) close();
    });
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

// ── Validation helpers ───────────────────────────────────────
function setFieldError(el, message) {
  clearFieldError(el);
  el.classList.add('has-error');
  const msg = document.createElement('span');
  msg.className = 'field-error';
  msg.textContent = message;
  el.appendChild(msg);
}

function clearFieldError(el) {
  el.classList.remove('has-error');
  el.querySelector('.field-error')?.remove();
}

function setFormError(form, message) {
  let banner = form.querySelector('.form-error-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'form-error-banner';
    form.prepend(banner);
  }
  banner.textContent = message;
}

// ── Legislator form ──────────────────────────────────────────
function openLegislatorForm(onSuccess, existing = null) {
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

// ── Legislation form ─────────────────────────────────────────
async function openLegislationForm(onSuccess, existing = null) {
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

  form.addEventListener('submit', async e => {
    e.preventDefault();

    let valid = true;
    [{ field: title, val: title.input.value }, { field: text, val: text.input.value }]
      .forEach(({ field, val }) => {
        if (!val.trim()) {
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

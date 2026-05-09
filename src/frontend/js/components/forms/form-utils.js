export function setFieldError(el, message) {
  clearFieldError(el);
  el.classList.add('has-error');
  const msg = document.createElement('span');
  msg.className = 'field-error';
  msg.textContent = message;
  el.appendChild(msg);
}

export function clearFieldError(el) {
  el.classList.remove('has-error');
  el.querySelector('.field-error')?.remove();
}

export function setFormError(form, message) {
  let banner = form.querySelector('.form-error-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'form-error-banner';
    form.prepend(banner);
  }
  banner.textContent = message;
}

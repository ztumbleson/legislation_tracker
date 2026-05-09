function createLongAnswer({ id, label, required = false, placeholder = '' }) {
  const group = document.createElement('div');
  group.className = 'form-group';

  const lbl = document.createElement('label');
  lbl.htmlFor = id;
  lbl.textContent = label;
  if (required) {
    const star = document.createElement('span');
    star.className = 'required-star';
    star.textContent = ' *';
    lbl.appendChild(star);
  }

  const input = document.createElement('textarea');
  input.id = id;
  input.name = id;
  input.placeholder = placeholder;
  input.rows = 5;

  group.appendChild(lbl);
  group.appendChild(input);

  return { el: group, input };
}

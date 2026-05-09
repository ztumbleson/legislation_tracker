function createSponsorSelect({ label, legislators = [] }) {
  const group = document.createElement('div');
  group.className = 'form-group';

  const lbl = document.createElement('label');
  lbl.textContent = label;

  const wrapper = document.createElement('div');
  wrapper.className = 'sponsor-select';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'sponsor-trigger';

  const pillsContainer = document.createElement('div');
  pillsContainer.className = 'sponsor-pills';

  const placeholderSpan = document.createElement('span');
  placeholderSpan.className = 'sponsor-placeholder';
  placeholderSpan.textContent = legislators.length ? 'Select sponsors...' : 'No legislators available';

  const chevron = document.createElement('span');
  chevron.className = 'sponsor-chevron';
  chevron.textContent = '▾';

  trigger.appendChild(pillsContainer);
  trigger.appendChild(placeholderSpan);
  trigger.appendChild(chevron);

  const dropdown = document.createElement('div');
  dropdown.className = 'sponsor-dropdown hidden';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'sponsor-search';
  searchInput.placeholder = 'Search legislators...';

  const list = document.createElement('div');
  list.className = 'sponsor-list';

  dropdown.appendChild(searchInput);
  dropdown.appendChild(list);

  wrapper.appendChild(trigger);
  wrapper.appendChild(dropdown);

  group.appendChild(lbl);
  group.appendChild(wrapper);

  const selected = new Set();

  function renderList(filter = '') {
    list.innerHTML = '';
    const term = filter.toLowerCase();
    const filtered = legislators.filter(l =>
      `${l.first_name} ${l.last_name}`.toLowerCase().includes(term)
    );

    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'sponsor-empty';
      empty.textContent = filter ? 'No matches' : 'No legislators available';
      list.appendChild(empty);
      return;
    }

    filtered.forEach(l => {
      const item = document.createElement('label');
      item.className = 'sponsor-item' + (selected.has(l.id) ? ' checked' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = l.id;
      checkbox.checked = selected.has(l.id);

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) selected.add(l.id);
        else selected.delete(l.id);
        item.classList.toggle('checked', checkbox.checked);
        renderPills();
      });

      item.appendChild(checkbox);
      item.appendChild(document.createTextNode(` ${l.first_name} ${l.last_name}`));
      list.appendChild(item);
    });
  }

  function renderPills() {
    pillsContainer.innerHTML = '';
    const selectedLegislators = legislators.filter(l => selected.has(l.id));

    if (selectedLegislators.length) {
      placeholderSpan.classList.add('hidden');
      selectedLegislators.forEach(l => {
        const pill = document.createElement('span');
        pill.className = 'sponsor-pill';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = `${l.first_name} ${l.last_name}`;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'pill-remove';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', e => {
          e.stopPropagation();
          selected.delete(l.id);
          renderPills();
          renderList(searchInput.value);
        });

        pill.appendChild(nameSpan);
        pill.appendChild(removeBtn);
        pillsContainer.appendChild(pill);
      });
    } else {
      placeholderSpan.classList.remove('hidden');
    }
  }

  trigger.addEventListener('click', () => {
    const isOpen = !dropdown.classList.contains('hidden');
    dropdown.classList.toggle('hidden', isOpen);
    if (!isOpen) {
      searchInput.value = '';
      renderList();
      searchInput.focus();
    }
  });

  searchInput.addEventListener('input', () => renderList(searchInput.value));

  const onDocClick = e => {
    if (!wrapper.contains(e.target)) dropdown.classList.add('hidden');
  };
  document.addEventListener('mousedown', onDocClick);

  renderList();

  return {
    el: group,
    getSelected: () => [...selected],
    reset() {
      selected.clear();
      renderPills();
      renderList();
    },
    destroy() {
      document.removeEventListener('mousedown', onDocClick);
    },
  };
}

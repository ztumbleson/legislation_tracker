export function buildDOM({ label, hasLegislators }) {
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
  placeholderSpan.textContent = hasLegislators ? 'Select sponsors...' : 'No legislators available';

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

  return { group, wrapper, trigger, pillsContainer, placeholderSpan, dropdown, searchInput, list };
}

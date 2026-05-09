async function loadPartials() {
  const partials = [
    { url: 'html/navbar.html',           slot: 'slot-navbar' },
    { url: 'html/view-legislators.html', slot: 'slot-legislators' },
    { url: 'html/view-legislation.html', slot: 'slot-legislation' },
    { url: 'html/modal.html',            slot: 'slot-modal' },
  ];

  await Promise.all(partials.map(async ({ url, slot }) => {
    const res = await fetch(url);
    document.getElementById(slot).innerHTML = await res.text();
  }));

  document.dispatchEvent(new Event('app:ready'));
}

loadPartials();

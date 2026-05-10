export const PAGE_SIZE = 10;

export function getPageSlice(data, page) {
  const start = (page - 1) * PAGE_SIZE;
  return data.slice(start, start + PAGE_SIZE);
}

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const set = new Set([1, total, current]);
  if (current > 1) set.add(current - 1);
  if (current < total) set.add(current + 1);

  const sorted = [...set].sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push('…');
    result.push(p);
    prev = p;
  }
  return result;
}

export function renderPagination(containerId, currentPage, totalPages, onPageChange) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  if (totalPages <= 1) return;

  const prevBtn = document.createElement('button');
  prevBtn.className = 'btn btn-sm btn-secondary';
  prevBtn.textContent = '← Prev';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => onPageChange(currentPage - 1));
  el.appendChild(prevBtn);

  const numbersDiv = document.createElement('div');
  numbersDiv.className = 'page-numbers';

  getPageNumbers(currentPage, totalPages).forEach(p => {
    if (typeof p === 'string') {
      const span = document.createElement('span');
      span.className = 'page-ellipsis';
      span.textContent = p;
      numbersDiv.appendChild(span);
      return;
    }
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm ' + (p === currentPage ? 'page-current' : 'btn-secondary');
    btn.textContent = p;
    if (p !== currentPage) btn.addEventListener('click', () => onPageChange(p));
    numbersDiv.appendChild(btn);
  });

  el.appendChild(numbersDiv);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-sm btn-secondary';
  nextBtn.textContent = 'Next →';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => onPageChange(currentPage + 1));
  el.appendChild(nextBtn);
}

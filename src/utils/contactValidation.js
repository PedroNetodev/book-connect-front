export function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

export function formatBrazilianPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  const ddd = digits.slice(0, 2);
  const firstPart = digits.slice(2, 7);
  const secondPart = digits.slice(7);

  if (digits.length <= 7) {
    return `(${ddd}) ${firstPart}`;
  }

  return `(${ddd}) ${firstPart}-${secondPart}`;
}

export function isValidBrazilianCellphone(value) {
  return /^\(\d{2}\) 9\d{4}-\d{4}$/.test(value);
}

export function isValidContactEmail(value) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(String(value || ''));
}

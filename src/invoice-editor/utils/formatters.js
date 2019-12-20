const longDateFormatter = new Intl.DateTimeFormat('nl-NL', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
const shortDateFormatter = new Intl.DateTimeFormat('nl-NL', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
const monthFormatter = new Intl.DateTimeFormat('nl-NL', { month: 'long' });
const numberFormatter = new Intl.NumberFormat('nl-NL');
const amountFormatter = new Intl.NumberFormat('nl-NL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: 'currency',
  currency: 'EUR',
  currencyDisplay: 'symbol',
});

function formatNumber(value) {
  return value ? numberFormatter.format(value) : null;
}

function formatAmount(value) {
  return value ? amountFormatter.format(value) : null;
}

function formatMonthLong(month) {
  return month != null ? monthFormatter.format(new Date(0, month)) : null;
}

function formatDateLong(value) {
  if (!value) {
    return value;
  }
  if (typeof value === 'string') {
    return longDateFormatter.format(new Date(value));
  }
  return longDateFormatter.format(value);
}

function formatDateShort(value) {
  if (!value) {
    return value;
  }
  if (typeof value === 'string') {
    return shortDateFormatter.format(new Date(value));
  }
  return shortDateFormatter.format(value);
}

export { formatNumber, formatAmount, formatDateLong, formatDateShort, formatMonthLong };

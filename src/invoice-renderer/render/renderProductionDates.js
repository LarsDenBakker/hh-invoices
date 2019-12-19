import { html } from 'lit-html';
import { formatMonthLong } from '../utils/formatters.js';

export function renderProductionDates(productionDates) {
  const text = productionDates
    .map(({ month, days: daysString }) => {
      const days = `${daysString}`.split(',').map(d => d.trim());

      if (days.length > 1) {
        const pre = days.slice(0, -1).join(', ');
        const post = `${days.slice(-1)} ${formatMonthLong(month - 1)}`;
        return `${pre} en ${post}`;
      }

      return `${days[0]} ${formatMonthLong(month - 1)}`;
    })
    .join(', ');

  return html`
    <div>Op ${text}</div>
  `;
}

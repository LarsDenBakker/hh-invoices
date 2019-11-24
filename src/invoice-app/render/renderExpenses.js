import { html } from 'lit-html';
import { formatAmount } from '../utils/formatters.js';

function sum(...args) {
  return (
    args.reduce((all, arg) => {
      return all + arg * 100;
    }, 0) / 100
  );
}

function multiply(a, b) {
  return (a * 100 * (b * 100)) / 10000;
}

export function renderExpenses(expenses) {
  const totalWithoutTax = sum(...expenses.map(({ count, cost }) => multiply(count, cost)));
  const tax = multiply(totalWithoutTax, 0.21);
  const totalWithTax = sum(totalWithoutTax, tax);

  return html`
    <div class="expenses-grid">
      <div class="expenses-heading">Omschrijving</div>
      <div class="expenses-heading">Aantal</div>
      <div class="expenses-heading">Prijs</div>
      <div class="expenses-heading">Bedrag</div>
      ${expenses.map(
        expense => html`
          <div>${expense.name}</div>
          <div>${expense.count}</div>
          <div>${formatAmount(expense.cost)}</div>
          <div>${formatAmount(multiply(expense.count, expense.cost))}</div>
        `,
      )}
    </div>

    <div class="expenses-summary-grid">
      <div>Subtotaal</div>
      <div>${formatAmount(totalWithoutTax)}</div>
      <div>BTW (21%)</div>
      <div>${formatAmount(tax)}</div>
      <div>Totaal inclusief BTW</div>
      <div>${formatAmount(totalWithTax)}</div>
    </div>
  `;
}

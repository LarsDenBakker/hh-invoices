import { html, render } from 'lit-html';
import { readInvoice } from './utils/readInvoice.js';
import { renderProductionDates } from './render/renderProductionDates.js';
import { renderExpenses } from './render/renderExpenses.js';

const { id, referenceId, name, recipient, invoiceDate, productions, expenses } = readInvoice();

document.title = `Factuur ${id} - ${name}`;

render(
  html`
    <div class="invoice">
      <div>
        <div class="header">
          <img src="/logo.png" />
          <div>Castricum, ${invoiceDate}</div>
        </div>

        <p class="invoice-id">Factuurnummer: ${id}</p>
        <div class="recipient">
          ${recipient.split('\n').map(
            r =>
              html`
                <div>${r}</div>
              `,
          )}
        </div>
      </div>

      <div>
        ${name
          ? html`
              <div>
                Hierbij bereken ik u voor mijn medewerking aan:
                <span class="production-name">${name}</span>
              </div>
            `
          : ''}
        ${productions ? renderProductionDates(productions) : ''}

        <p>
          ${referenceId
            ? html`
                Bestelnummer: ${referenceId}
              `
            : ''}
        </p>

        ${renderExpenses(expenses)}

        <p>
          Gaarne uw betaling binnen 14 dagen na factuurdatum op onderstaande rekening over te maken.
        </p>
      </div>

      <div>
        <div class="address">
          <div>Astrid Vreeken</div>
          <div>Doctor Ramaerlaan 22</div>
          <div>1901 KW Castricum</div>
        </div>
        <div class="contact-details">
          <div>Tel: 06 16904155</div>
          <div>E-mail: vreekenastrid@gmail.com</div>
          <div>BTW nummer: NL070360534B01</div>
          <div>KvK nummer: 56928920</div>
        </div>
        <p class="iban">IBAN: NL21 RABO 0152 7513 00</p>
      </div>
    </div>
  `,
  document.body,
);

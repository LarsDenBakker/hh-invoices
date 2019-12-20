import { LitElement, customElement, html, property } from 'lit-element';
import { Invoice, Expense, Production } from '../invoice/Invoice';
import '@lion/form/lion-form.js';
import '@lion/input/lion-input.js';
import '@lion/select/lion-select.js';
import '@lion/input-datepicker/lion-input-datepicker.js';

@customElement('hh-invoice-editor')
class InvoiceEditor extends LitElement {
  @property() selectedInvoice: Invoice = null;

  render() {
    return html`
      <lion-form>
        <form>
          <lion-input name="id" label="Factuurnummer"></lion-input>
          <lion-input name="referenceId" label="Bestelnummer"></lion-input>
          <lion-input name="name" label="Productie"></lion-input>
          <lion-select name="recipient">
            <div slot="label">Klant</div>
            <select slot="input">
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </lion-select>
          <lion-input-datepicker name="date" label="Datum"></lion-input-datepicker>
        </form>
      </lion-form>
    `;
  }
}

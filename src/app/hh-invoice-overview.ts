import { LitElement, html, css, customElement, property } from 'lit-element';
import '@material/mwc-button';
import { Invoice, Expense, Production } from '../invoice/Invoice';
import { readInvoices, readInvoiceDetails } from '../gapi/sheets';
import { when } from '../utils';

@customElement('hh-invoice-overview')
class HhHeader extends LitElement {
  @property() invoices: Invoice[] | null = null;
  @property() selectedInvoice: Invoice | null = null;
  @property() loading = false;
  @property() error = false;

  static styles = css`
    :host {
      display: block;
    }

    .invoices {
      display: grid;
      margin: 0 auto;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      grid-gap: 8px;
    }

    .invoices > div {
      margin: 0 auto;
    }

    .save-button-wrapper {
      margin: 16px 0;
      display: flex;
      justify-content: flex-end;
    }

    iframe {
      height: 1000px;
      width: 100%;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();

    try {
      console.log('Fetching invoices...');
      this.loading = true;
      this.invoices = await readInvoices();
      console.log('Fetched invoices');
    } catch (error) {
      this.error = true;
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return html`
        <p>Loading...</p>
      `;
    }
    if (this.error) {
      return html`
        <p>Something went wrong getting invoices.</p>
      `;
    }

    if (this.invoices) {
      return html`
        <p><strong>Select an invoice:</strong></p>

        <div class="invoices">
          ${this.invoices
            .filter(_ => !!_.id)
            .map(
              invoice =>
                html`
                  <div>
                    <mwc-button outlined @click=${() => this.printInvoice(invoice)}>
                      ${invoice.id}
                    </mwc-button>
                  </div>
                `,
            )}
        </div>

        <div class="save-button-wrapper">
          <mwc-button class="save-button" outlined raised @click=${this.onSave}>Save</mwc-button>
        </div>

        ${when(
          this.selectedInvoice,
          () => html`
            <iframe
              src="/invoice.html?invoice=${encodeURIComponent(
                JSON.stringify(this.selectedInvoice),
              )}"
            ></iframe>
          `,
        )}
      `;
    }
  }

  private async printInvoice(invoice: Invoice) {
    this.selectedInvoice = await readInvoiceDetails(invoice);
  }

  private onSave() {
    this.shadowRoot!.querySelector('iframe').contentWindow.print();
  }
}

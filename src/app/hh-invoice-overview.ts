import { LitElement, html, css, customElement, property } from 'lit-element';
import '@material/mwc-button';
import { Invoice, Expense, Production } from '../invoice/Invoice';
import { readInvoices, readInvoiceDetails } from '../gapi/sheets';

@customElement('hh-invoice-overview')
class HhHeader extends LitElement {
  @property() invoices: Invoice[] | null = null;
  @property() loading = false;
  @property() error = false;

  static styles = css`
    :host {
      display: block;
    }

    .invoices {
      display: flex;
      flex-wrap: wrap;
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
        <p>Select an invoice:</p>
        <div class="invoices">
          ${this.invoices
            .filter(_ => !!_.id)
            .map(
              invoice =>
                html`
                  <mwc-button @click=${() => this.printInvoice(invoice)}>
                    ${invoice.id}
                  </mwc-button>
                `,
            )}
        </div>
      `;
    }
  }

  private async printInvoice(invoice: Invoice) {
    const invoiceWithDetails = await readInvoiceDetails(invoice);
    window.open(
      `/invoice.html?invoice=${encodeURIComponent(JSON.stringify(invoiceWithDetails))}`,
      '_blank',
    );
  }
}

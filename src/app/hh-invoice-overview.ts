import { LitElement, html, css, customElement, property } from 'lit-element';
import '@material/mwc-button';
import { Invoice, Expense, Production } from '../invoice/Invoice';
import { readInvoices, readInvoiceDetails } from '../gapi/sheets';
import { when } from '../utils';

@customElement('hh-invoice-overview')
class HhHeader extends LitElement {
  @property() invoices: Invoice[] | null = null;
  @property() selectedInvoice: Invoice | null = null;
  @property() fetchingOverview = false;
  @property() fetchingDetails = false;
  @property() error = false;

  static styles = css`
    :host {
      display: block;
      text-align: center;
    }

    .invoices {
      display: flex;
      justify-content: center;
    }

    select {
      font-size: 24px;
      margin-right: 8px;
    }

    iframe {
      display: block;
      height: 1000px;
      width: 100%;
      border-radius: 8px;
      border: none;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();

    try {
      console.log('Fetching invoices...');
      this.fetchingOverview = true;
      this.invoices = await readInvoices();
      console.log('Fetched invoices');
    } catch (error) {
      this.error = true;
      console.error(error);
    } finally {
      this.fetchingOverview = false;
    }
  }

  render() {
    if (this.fetchingOverview) {
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
        <div class="invoices">
          <select @change=${this.onSelectedInvoiceChanged}>
            <option>Select an invoice</option>
            ${this.invoices
              .filter(_ => !!_.id)
              .map(
                invoice =>
                  html`
                    <option>${invoice.id}</option>
                  `,
              )}
          </select>

          <mwc-button
            class="save-button"
            outlined
            raised
            .disabled=${!this.selectedInvoice || this.fetchingDetails}
            @click=${this.onSave}
          >
            Save
          </mwc-button>
        </div>

        <p class="details">
          ${when(
            this.fetchingDetails,
            () =>
              html`
                Loading...
              `,
          )}
          ${when(
            !this.fetchingDetails && this.selectedInvoice,
            () => html`
              <iframe
                src="/invoice.html?invoice=${encodeURIComponent(
                  JSON.stringify(this.selectedInvoice),
                )}"
              ></iframe>
            `,
          )}
        </p>
      `;
    }
  }

  private async selectInvoice(invoice: Invoice) {
    try {
      this.fetchingDetails = true;
      this.selectedInvoice = await readInvoiceDetails(invoice);
    } catch (error) {
      this.selectedInvoice = null;
      alert('ER GING IETS FOUT!');
    } finally {
      this.fetchingDetails = false;
    }
  }

  private onSelectedInvoiceChanged(e) {
    const id = Number(e.target.value);
    const invoice = this.invoices!.find(i => ((i.id as unknown) as number) === id);
    if (invoice) {
      this.selectInvoice(invoice);
    } else {
      this.selectedInvoice = null;
    }
  }

  private onSave() {
    const iframe = this.shadowRoot!.querySelector('iframe');
    if (iframe) {
      const oldTitle = document.title;
      document.title = iframe.contentDocument!.title;
      iframe.contentWindow!.print();
      document.title = oldTitle;
    }
  }
}

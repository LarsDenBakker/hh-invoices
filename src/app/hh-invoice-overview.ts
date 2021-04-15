import { LitElement, html, css, customElement, property } from 'lit-element';
import '@material/mwc-button';
import { Invoice, Expense, Production } from '../invoice/Invoice';
import { readInvoices, readInvoiceDetails, spreadsheetIds } from '../gapi/sheets';
import { when } from '../utils';

function findDefaultSpreadsheet() {
  const currentYear = new Date().getFullYear();
  let yearToSelect = currentYear;
  while (!spreadsheetIds[yearToSelect] && yearToSelect >= currentYear - 50) {
    yearToSelect--;
  }

  if (!spreadsheetIds[yearToSelect]) {
    return Object.keys(spreadsheetIds)[0];
  }
  return String(yearToSelect);
}

@customElement('hh-invoice-overview')
class HhHeader extends LitElement {
  @property() invoices: Invoice[] | null = null;
  @property() selectedInvoice: Invoice | null = null;
  @property() fetchingOverview = false;
  @property() fetchingDetails = false;
  @property() error = false;
  @property() spreadSheetName = findDefaultSpreadsheet();

  static styles = css`
    :host {
      display: block;
      text-align: center;
    }

    .buttons {
      display: flex;
      justify-content: center;
    }

    .buttons > * {
      margin-right: 8px;
    }

    .invoices {
      text-align: left;
      margin: 24px auto;
      font-size: 16px;
      border-collapse: collapse;
      vertical-align: center;
    }

    .invoices tr {
      border: 1px solid black;
      padding: 2px;
    }

    .invoices tr:hover {
      background-color: lightgray;
      cursor: pointer;
    }

    .invoices th,
    .invoices td {
      padding: 4px;
    }

    select {
      font-size: 24px;
      margin: 0 8px;
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
    this.updateInvoices();
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
        <div class="buttons">
          <select @change=${this.selectSpreadSheet}>
            ${Object.keys(spreadsheetIds).map(
              id => html`
                <option .selected=${id === this.spreadSheetName}>${id}</option>
              `,
            )}
          </select>
          <mwc-button
            outlined
            raised
            .disabled=${this.fetchingDetails || !this.selectedInvoice}
            @click=${this.onBack}
          >
            Terug
          </mwc-button>

          <mwc-button
            outlined
            raised
            .disabled=${this.fetchingDetails || !this.selectedInvoice}
            @click=${this.onSave}
          >
            Opslaan
          </mwc-button>
        </div>

        ${when(
          this.invoices && !this.fetchingDetails && !this.selectedInvoice,
          () => html`
            <table class="invoices">
              <tr>
                <th>Nummer</th>
                <th>Naam</th>
                <th>Klant</th>
              </tr>
              ${this.invoices!.map(
                invoice => html`
                  <tr @click=${() => this.selectInvoice(invoice)}>
                    <td>${invoice.id}</td>
                    <td>${invoice.name}</td>
                    <td>${invoice.recipient}</td>
                  </tr>
                `,
              )}
            </table>
          `,
        )}

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
      this.selectedInvoice = await readInvoiceDetails(
        spreadsheetIds[this.spreadSheetName],
        invoice,
      );
    } catch (error) {
      this.selectedInvoice = null;
      alert('Er ging iets mis bij het inladen van deze factuur...');
    } finally {
      this.fetchingDetails = false;
    }
  }

  private async updateInvoices() {
    try {
      console.log('Fetching invoices...');
      this.fetchingOverview = true;
      this.invoices = await readInvoices(spreadsheetIds[this.spreadSheetName]);
      console.log('Fetched invoices');
    } catch (error) {
      this.error = true;
      console.error(error);
    } finally {
      this.fetchingOverview = false;
    }
  }

  private onBack() {
    this.selectedInvoice = null;
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

  private selectSpreadSheet(e: Event) {
    this.spreadSheetName = (e.target as HTMLSelectElement).value;
    this.updateInvoices();
  }
}

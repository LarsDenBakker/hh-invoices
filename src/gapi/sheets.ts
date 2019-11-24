import gapi from './gapi';
import { Invoice, Expense, Production } from '../invoice/Invoice';

const spreadsheetId = '1XMjYbQ6tG01Vc3QQ6KIq7eRtrA0U9OLgU6j8MJi8egg';

type Spreadsheets = gapi.client.sheets.SpreadsheetsResource;

export async function readOverview() {
  await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Class Data!A2:E',
  });
}

type MappedObject = { [key: string]: string };

interface Recipient {
  name: string;
  address: string;
}

const invoiceSheetMappings: MappedObject = {
  Nummer: 'id',
  Referentienummer: 'referenceId',
  Naam: 'name',
  Klant: 'recipient',
  Datum: 'invoiceDate',
  'Productie data': 'productions',
  Kosten: 'expenses',
};

const expenseSheetMappings: MappedObject = {
  Naam: 'name',
  Aantal: 'count',
  Kosten: 'cost',
};

const productionDatesMappings: MappedObject = {
  Jaar: 'year',
  Maand: 'month',
  Dagen: 'days',
};

const recipientMappings: MappedObject = {
  Naam: 'name',
  Adres: 'address',
};

function mapRows(rows: string[][], headingMappings: MappedObject) {
  if (!rows) {
    return null;
  }
  const rowHeadings = rows[0];

  return rows.slice(1).map(row =>
    row.reduce((obj, cell, i) => {
      const sheetHeading = rowHeadings[i];

      if (!headingMappings[sheetHeading]) {
        return obj;
      }

      return {
        ...obj,
        [headingMappings[sheetHeading]]: cell,
      };
    }, {}),
  );
}

async function readValues(spreadsheets: Spreadsheets, range: string) {
  const response = await spreadsheets.values.get({
    spreadsheetId,
    valueRenderOption: 'UNFORMATTED_VALUE',
    range,
  });

  return JSON.parse(response.body).values;
}

async function readRows(spreadsheets: Spreadsheets, range: string, headingMappings: MappedObject) {
  const rows = await readValues(spreadsheets, range);
  return mapRows(rows, headingMappings);
}

export async function readInvoices() {
  const { spreadsheets } = gapi.client.sheets;
  return readRows(spreadsheets, 'Facturen!A:H', invoiceSheetMappings) as Promise<Invoice[]>;
}

export async function readInvoiceDetails(invoice: Invoice) {
  const { spreadsheets } = gapi.client.sheets;

  // TODO: caching

  const recipients = (await readRows(
    spreadsheets,
    'Klanten!A:B',
    recipientMappings,
  )) as Recipient[];

  const expenses = (await readRows(
    spreadsheets,
    `${invoice.id}!A:D`,
    expenseSheetMappings,
  )) as Expense[];

  const productions = (await readRows(
    spreadsheets,
    `${invoice.id}!F:H`,
    productionDatesMappings,
  )) as Production[];

  const { name, address } = recipients.find(r => r.name === invoice.recipient)!;

  return {
    ...invoice,
    recipient: address ? `${name}\n${address}` : name,
    expenses: expenses,
    productions: productions,
  };
}

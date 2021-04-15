import gapi from './gapi';
import { Invoice, Expense, Production } from '../invoice/Invoice';

export const spreadsheetIds: Record<string, string> = {
  2017: '1lffbhUnOBdDwTrq2qwElBK-pHKyUvZUOFlBrzH61qnM',
  2018: '1mdLGHuyxaGoIMEUB_oqgnzxXEKr5op-PiPQaB3a-1SE',
  2019: '1XMjYbQ6tG01Vc3QQ6KIq7eRtrA0U9OLgU6j8MJi8egg',
  2020: '1pkyVKHuNAj6_bE862frnz4k3c2Z7OQPEO4aUv5qf7WQ',
  2021: '1GJq5REEUSFW_DGpvOyIbH-Meg7gFI7kVe18kK2R4yG8',
};

type Spreadsheets = gapi.client.sheets.SpreadsheetsResource;

type MappedObject = { [key: string]: string };

interface Recipient {
  name: string;
  address: string;
}

const invoiceSheetMappings: MappedObject = {
  Nummer: 'id',
  Referentienummer: 'referenceId',
  Naam: 'name',
  Omschrijving: 'description',
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

function mapRows<T>(rows: string[][], headingMappings: MappedObject): T[] {
  if (!rows) {
    return [];
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
  ) as T[];
}

async function readValues(spreadsheetId: string, spreadsheets: Spreadsheets, range: string) {
  const response = await spreadsheets.values.get({
    spreadsheetId,
    valueRenderOption: 'UNFORMATTED_VALUE',
    range,
  });

  return JSON.parse(response.body).values;
}

async function readRows(
  spreadsheetId: string,
  spreadsheets: Spreadsheets,
  range: string,
  headingMappings: MappedObject,
): Promise<Invoice[]> {
  const rows = await readValues(spreadsheetId, spreadsheets, range);
  return mapRows(rows, headingMappings);
}

export async function readInvoices(spreadsheetId: string) {
  const { spreadsheets } = gapi.client.sheets;
  const allRows = await readRows(spreadsheetId, spreadsheets, 'Facturen!A:I', invoiceSheetMappings);
  return allRows.filter(r => !!r.id);
}

export async function readInvoiceDetails(spreadsheetId: string, invoice: Invoice) {
  const { spreadsheets } = gapi.client.sheets;

  // TODO: caching

  const recipients = (await readRows(
    spreadsheetId,
    spreadsheets,
    'Klanten!A:B',
    recipientMappings,
  )) as Recipient[];

  const expenses = (await readRows(
    spreadsheetId,
    spreadsheets,
    `${invoice.id}!A:D`,
    expenseSheetMappings,
  )) as Expense[];

  const productions = (await readRows(
    spreadsheetId,
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

import { parseQueryParams } from './parseQueryParams.js';

export function readInvoice() {
  const queryParams = parseQueryParams();
  if (!queryParams) {
    throw new Error('No query params found.');
  }

  const { invoice: invoiceJSON } = queryParams;
  if (!invoiceJSON) {
    throw new Error('No invoice found in query params.');
  }

  return JSON.parse(invoiceJSON);
}

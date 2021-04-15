export interface Production {
  year: number;
  month: number;
  days: string[];
}

export interface Expense {
  name: string;
  count: number;
  cost: string;
  tax?: 'high' | 'low';
}

export interface Invoice {
  id: string;
  referenceId?: string;
  name: string;
  description?: string;
  recipient: string;
  location: string;
  invoiceDate: String;
  productions?: Production[];
  expenses: Expense[];
}

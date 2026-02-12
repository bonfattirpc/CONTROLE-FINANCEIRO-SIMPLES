
export type ExpenseType = 'FIXA' | 'VARIÁVEL';
export type ExpenseStatus = 'PAGO' | 'A PAGAR';

export interface Income {
  id: string;
  description: string;
  type: string;
  value: number;
}

export interface Expense {
  id: string;
  type: ExpenseType;
  description: string;
  value: number;
  date: string;
  status: ExpenseStatus;
  installmentsCount?: number;
  currentInstallment?: number;
  seriesId?: string; // Links installments together
}

export interface MonthData {
  month: number; // 0-11
  year: number;
  incomes: Income[];
  expenses: Expense[];
}

export interface AnnualData {
  [yearMonthKey: string]: MonthData;
}

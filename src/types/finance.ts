export type Role = 'viewer' | 'admin'

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  type: TransactionType
  note?: string
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Other',
] as const

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Other'] as const

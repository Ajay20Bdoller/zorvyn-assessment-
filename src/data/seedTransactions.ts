import type { Transaction } from '../types/finance'

/** Deterministic seed for charts and demos */
export const SEED_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2026-01-05', amount: 5200, category: 'Salary', type: 'income', note: 'Monthly pay' },
  { id: '2', date: '2026-01-08', amount: 120, category: 'Food', type: 'expense', note: 'Groceries' },
  { id: '3', date: '2026-01-12', amount: 45, category: 'Transport', type: 'expense' },
  { id: '4', date: '2026-01-18', amount: 89, category: 'Shopping', type: 'expense' },
  { id: '5', date: '2026-01-22', amount: 210, category: 'Bills', type: 'expense', note: 'Utilities' },
  { id: '6', date: '2026-01-28', amount: 650, category: 'Freelance', type: 'income' },
  { id: '7', date: '2026-02-03', amount: 5200, category: 'Salary', type: 'income' },
  { id: '8', date: '2026-02-07', amount: 180, category: 'Food', type: 'expense' },
  { id: '9', date: '2026-02-10', amount: 60, category: 'Transport', type: 'expense' },
  { id: '10', date: '2026-02-14', amount: 140, category: 'Entertainment', type: 'expense' },
  { id: '11', date: '2026-02-20', amount: 95, category: 'Shopping', type: 'expense' },
  { id: '12', date: '2026-02-25', amount: 200, category: 'Bills', type: 'expense' },
  { id: '13', date: '2026-03-02', amount: 5200, category: 'Salary', type: 'income' },
  { id: '14', date: '2026-03-06', amount: 220, category: 'Food', type: 'expense' },
  { id: '15', date: '2026-03-09', amount: 400, category: 'Health', type: 'expense', note: 'Checkup' },
  { id: '16', date: '2026-03-15', amount: 75, category: 'Transport', type: 'expense' },
  { id: '17', date: '2026-03-19', amount: 320, category: 'Shopping', type: 'expense' },
  { id: '18', date: '2026-03-24', amount: 195, category: 'Bills', type: 'expense' },
  { id: '19', date: '2026-03-29', amount: 1100, category: 'Freelance', type: 'income' },
  { id: '20', date: '2026-04-01', amount: 5200, category: 'Salary', type: 'income' },
  { id: '21', date: '2026-04-02', amount: 95, category: 'Food', type: 'expense' },
  { id: '22', date: '2026-04-03', amount: 50, category: 'Transport', type: 'expense' },
]

export const OPENING_BALANCE = 2400

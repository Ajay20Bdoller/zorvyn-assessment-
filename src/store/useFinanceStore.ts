import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { OPENING_BALANCE, SEED_TRANSACTIONS } from '../data/seedTransactions'
import type { Role, Transaction, TransactionType } from '../types/finance'

export type SortKey = 'date' | 'amount'
export type SortDir = 'asc' | 'desc'

interface FinanceState {
  role: Role
  darkMode: boolean
  transactions: Transaction[]
  filterCategory: string
  filterType: 'all' | TransactionType
  search: string
  sortKey: SortKey
  sortDir: SortDir
  setRole: (role: Role) => void
  setDarkMode: (value: boolean) => void
  setFilterCategory: (c: string) => void
  setFilterType: (t: 'all' | TransactionType) => void
  setSearch: (s: string) => void
  setSort: (key: SortKey, dir: SortDir) => void
  addTransaction: (t: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, patch: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  resetToSeed: () => void
}

function newId(): string {
  return crypto.randomUUID()
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      role: 'admin',
      darkMode: false,
      transactions: SEED_TRANSACTIONS,
      filterCategory: 'all',
      filterType: 'all',
      search: '',
      sortKey: 'date',
      sortDir: 'desc',

      setRole: (role) => set({ role }),
      setDarkMode: (darkMode) => set({ darkMode }),
      setFilterCategory: (filterCategory) => set({ filterCategory }),
      setFilterType: (filterType) => set({ filterType }),
      setSearch: (search) => set({ search }),
      setSort: (sortKey, sortDir) => set({ sortKey, sortDir }),

      addTransaction: (t) =>
        set((s) => ({
          transactions: [{ ...t, id: newId() }, ...s.transactions],
        })),

      updateTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((x) =>
            x.id === id ? { ...x, ...patch } : x,
          ),
        })),

      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((x) => x.id !== id),
        })),

      resetToSeed: () => set({ transactions: [...SEED_TRANSACTIONS] }),
    }),
    {
      name: 'finance-dashboard',
      partialize: (s) => ({
        transactions: s.transactions,
        darkMode: s.darkMode,
        role: s.role,
      }),
    },
  ),
)

export function getOpeningBalance(): number {
  return OPENING_BALANCE
}

export function selectSummary(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((a, t) => a + t.amount, 0)
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((a, t) => a + t.amount, 0)
  const balance = OPENING_BALANCE + income - expenses
  return { income, expenses, balance }
}

export function selectFilteredTransactions(
  transactions: Transaction[],
  filterCategory: string,
  filterType: 'all' | TransactionType,
  search: string,
  sortKey: SortKey,
  sortDir: SortDir,
): Transaction[] {
  const q = search.trim().toLowerCase()
  let list = transactions

  if (filterType !== 'all') {
    list = list.filter((t) => t.type === filterType)
  }
  if (filterCategory !== 'all') {
    list = list.filter((t) => t.category === filterCategory)
  }
  if (q) {
    list = list.filter(
      (t) =>
        t.category.toLowerCase().includes(q) ||
        (t.note?.toLowerCase().includes(q) ?? false) ||
        t.amount.toString().includes(q),
    )
  }

  const mul = sortDir === 'asc' ? 1 : -1
  return [...list].sort((a, b) => {
    if (sortKey === 'amount') {
      return (a.amount - b.amount) * mul
    }
    return (new Date(a.date).getTime() - new Date(b.date).getTime()) * mul
  })
}

export function selectMonthlyBuckets(transactions: Transaction[]) {
  const map = new Map<string, { income: number; expense: number }>()
  for (const t of transactions) {
    const key = t.date.slice(0, 7)
    const cur = map.get(key) ?? { income: 0, expense: 0 }
    if (t.type === 'income') cur.income += t.amount
    else cur.expense += t.amount
    map.set(key, cur)
  }
  const keys = [...map.keys()].sort()
  let running = OPENING_BALANCE
  return keys.map((month) => {
    const { income, expense } = map.get(month)!
    running += income - expense
    return {
      month,
      label: new Date(month + '-01').toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      income,
      expense,
      balance: running,
    }
  })
}

export function selectExpenseByCategory(transactions: Transaction[]) {
  const map = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

const CHART_COLORS = [
  '#8b5cf6',
  '#14b8a6',
  '#f472b6',
  '#fbbf24',
  '#3b82f6',
  '#a78bfa',
  '#94a3b8',
]

export function categoryColors(names: string[]): Record<string, string> {
  const out: Record<string, string> = {}
  names.forEach((n, i) => {
    out[n] = CHART_COLORS[i % CHART_COLORS.length]
  })
  return out
}

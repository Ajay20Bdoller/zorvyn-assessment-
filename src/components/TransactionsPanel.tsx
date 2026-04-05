import { useMemo, useState } from 'react'
import type { Transaction } from '../types/finance'
import { formatCurrency, formatDate } from '../lib/format'
import {
  selectFilteredTransactions,
  useFinanceStore,
} from '../store/useFinanceStore'
import { TransactionFormModal } from './TransactionFormModal'

const fieldClass =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100'

function IconLedger() {
  return (
    <svg
      className="h-8 w-8 text-violet-500 dark:text-violet-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}

function IconEye() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  )
}

export function TransactionsPanel() {
  const role = useFinanceStore((s) => s.role)
  const transactions = useFinanceStore((s) => s.transactions)
  const filterCategory = useFinanceStore((s) => s.filterCategory)
  const filterType = useFinanceStore((s) => s.filterType)
  const search = useFinanceStore((s) => s.search)
  const sortKey = useFinanceStore((s) => s.sortKey)
  const sortDir = useFinanceStore((s) => s.sortDir)
  const setFilterCategory = useFinanceStore((s) => s.setFilterCategory)
  const setFilterType = useFinanceStore((s) => s.setFilterType)
  const setSearch = useFinanceStore((s) => s.setSearch)
  const setSort = useFinanceStore((s) => s.setSort)
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction)
  const resetToSeed = useFinanceStore((s) => s.resetToSeed)

  const [modal, setModal] = useState<
    | { open: true; mode: { type: 'create' } | { type: 'edit'; transaction: Transaction } }
    | { open: false; mode: null }
  >({ open: false, mode: null })

  const filtered = useMemo(
    () =>
      selectFilteredTransactions(
        transactions,
        filterCategory,
        filterType,
        search,
        sortKey,
        sortDir,
      ),
    [transactions, filterCategory, filterType, search, sortKey, sortDir],
  )

  const categoryOptions = useMemo(() => {
    const set = new Set<string>()
    transactions.forEach((t) => set.add(t.category))
    return ['all', ...[...set].sort()]
  }, [transactions])

  const isAdmin = role === 'admin'

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-slate-900/[0.04] backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/60 dark:shadow-black/40"
      aria-labelledby="tx-heading"
    >
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-teal-400 opacity-90" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="tx-heading"
            className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Transactions
          </h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            Filter, sort, and search the ledger
          </p>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setModal({ open: true, mode: { type: 'create' } })}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 active:scale-[0.98]"
            >
              <span className="text-lg leading-none">+</span>
              Add transaction
            </button>
            <button
              type="button"
              onClick={() => resetToSeed()}
              className="rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-violet-500/40"
            >
              Reset demo
            </button>
          </div>
        )}
      </div>

      {!isAdmin && (
        <div className="relative mt-4 flex gap-3 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/50 px-4 py-3 dark:border-amber-500/20 dark:from-amber-950/40 dark:to-orange-950/20">
          <IconEye />
          <p className="text-sm leading-snug text-amber-950 dark:text-amber-100/90">
            <strong className="font-semibold">Viewer mode</strong> — read-only. Switch to{' '}
            <strong>Admin</strong> in the header to add or edit transactions.
          </p>
        </div>
      )}

      <div className="relative mt-5 rounded-2xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/50 dark:bg-slate-950/40">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="sm:col-span-2 lg:col-span-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Search
            </span>
            <input
              type="search"
              placeholder="Category, note, amount…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Type
            </span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              className={fieldClass}
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Category
            </span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={fieldClass}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All categories' : c}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sort by
            </span>
            <div className="mt-1.5 flex gap-2">
              <select
                value={sortKey}
                onChange={(e) => setSort(e.target.value as 'date' | 'amount', sortDir)}
                className={`${fieldClass} flex-1`}
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
              <select
                value={sortDir}
                onChange={(e) => setSort(sortKey, e.target.value as 'asc' | 'desc')}
                className={`${fieldClass} w-[5.5rem] shrink-0`}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </label>
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-inner shadow-slate-900/[0.03] dark:border-slate-700/80 dark:bg-slate-950/50 dark:shadow-black/20">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-slate-50 shadow-inner dark:from-violet-950/50 dark:to-slate-900">
              <IconLedger />
            </div>
            <div>
              <p className="font-display text-base font-bold text-slate-800 dark:text-slate-100">
                Ledger is empty
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Switch to Admin and add entries, or restore the bundled demo dataset.
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => resetToSeed()}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-500"
              >
                Load demo data
              </button>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium text-slate-700 dark:text-slate-300">No matching rows</p>
            <p className="mt-1 text-sm text-slate-500">
              Try clearing search or setting filters to “All”.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-violet-50/30 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:from-slate-900 dark:to-violet-950/20 dark:text-slate-400">
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5 text-right">Amount</th>
                  <th className="px-4 py-3.5">Note</th>
                  {isAdmin && <th className="px-4 py-3.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    className={`transition hover:bg-violet-50/40 dark:hover:bg-violet-950/20 ${
                      i % 2 === 1 ? 'bg-slate-50/40 dark:bg-slate-900/30' : ''
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {t.category}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                          t.type === 'income'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums ${
                        t.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '−'}
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-slate-500 dark:text-slate-500">
                      {t.note ?? '—'}
                    </td>
                    {isAdmin && (
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setModal({ open: true, mode: { type: 'edit', transaction: t } })
                          }
                          className="mr-3 text-sm font-semibold text-violet-600 transition hover:text-violet-500 dark:text-violet-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTransaction(t.id)}
                          className="text-sm font-semibold text-rose-600 transition hover:text-rose-500 dark:text-rose-400"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TransactionFormModal
        open={modal.open}
        mode={modal.open ? modal.mode : null}
        onClose={() => setModal({ open: false, mode: null })}
      />
    </section>
  )
}

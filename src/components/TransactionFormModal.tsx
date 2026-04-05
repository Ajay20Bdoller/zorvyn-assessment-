import { useEffect, useState, type FormEvent } from 'react'
import type { Transaction, TransactionType } from '../types/finance'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types/finance'
import { useFinanceStore } from '../store/useFinanceStore'

type Mode = { type: 'create' } | { type: 'edit'; transaction: Transaction }

interface Props {
  open: boolean
  mode: Mode | null
  onClose: () => void
}

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  category: 'Food',
  type: 'expense' as TransactionType,
  note: '',
}

const inputClass =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-inner shadow-slate-900/5 transition placeholder:text-slate-400 focus:border-violet-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:shadow-black/20 dark:focus:border-violet-500'

export function TransactionFormModal({ open, mode, onClose }: Props) {
  const addTransaction = useFinanceStore((s) => s.addTransaction)
  const updateTransaction = useFinanceStore((s) => s.updateTransaction)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!open || !mode) return
    if (mode.type === 'edit') {
      const t = mode.transaction
      setForm({
        date: t.date,
        amount: String(t.amount),
        category: t.category,
        type: t.type,
        note: t.note ?? '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [open, mode])

  if (!open || !mode) return null

  const activeMode = mode
  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function submit(e: FormEvent) {
    e.preventDefault()
    const amount = Number.parseFloat(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) return

    const payload = {
      date: form.date,
      amount,
      category: form.category,
      type: form.type,
      note: form.note.trim() || undefined,
    }

    if (activeMode.type === 'edit') {
      updateTransaction(activeMode.transaction.id, payload)
    } else {
      addTransaction(payload)
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-md sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-violet-500/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/50">
        <div className="relative bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-6 py-5 dark:from-violet-700 dark:via-fuchsia-700">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-90" />
          <h2
            id="tx-modal-title"
            className="relative font-display text-xl font-bold tracking-tight text-white"
          >
            {mode.type === 'edit' ? 'Edit transaction' : 'New transaction'}
          </h2>
          <p className="relative mt-1 text-xs font-medium text-white/80">
            {mode.type === 'edit' ? 'Update fields below.' : 'Log income or spending.'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => {
                  const type = e.target.value as TransactionType
                  const nextCats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
                  setForm((f) => ({
                    ...f,
                    type,
                    category: (nextCats as readonly string[]).includes(f.category)
                      ? f.category
                      : nextCats[0],
                  }))
                }}
                className={inputClass}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Date
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Amount
            </label>
            <input
              type="number"
              required
              min={0.01}
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className={`${inputClass} font-mono`}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Note <span className="font-normal normal-case text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="e.g. Weekly shop"
              className={inputClass}
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 active:scale-[0.98]"
            >
              {mode.type === 'edit' ? 'Save changes' : 'Add to ledger'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

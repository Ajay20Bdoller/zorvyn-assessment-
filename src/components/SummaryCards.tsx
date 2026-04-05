import { useMemo } from 'react'
import { formatCurrency } from '../lib/format'
import { selectSummary, useFinanceStore } from '../store/useFinanceStore'

function IconWallet({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  )
}

function IconTrendUp({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function IconTrendDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  )
}

export function SummaryCards() {
  const transactions = useFinanceStore((s) => s.transactions)
  const summary = useMemo(() => selectSummary(transactions), [transactions])

  const cards = [
    {
      label: 'Total balance',
      value: summary.balance,
      hint: 'Opening + income − expenses',
      icon: IconWallet,
      border: 'border-violet-200/60 dark:border-violet-500/25',
      gradient:
        'from-violet-500/15 via-white to-fuchsia-500/10 dark:from-violet-500/20 dark:via-slate-900 dark:to-fuchsia-500/15',
      iconBg: 'bg-violet-500/15 text-violet-700 dark:bg-violet-500/25 dark:text-violet-300',
      valueClass: 'text-slate-900 dark:text-white',
    },
    {
      label: 'Income',
      value: summary.income,
      hint: 'All credited amounts',
      icon: IconTrendUp,
      border: 'border-emerald-200/60 dark:border-emerald-500/25',
      gradient:
        'from-emerald-500/15 via-white to-teal-500/10 dark:from-emerald-500/15 dark:via-slate-900 dark:to-teal-500/10',
      iconBg: 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300',
      valueClass: 'text-emerald-700 dark:text-emerald-400',
    },
    {
      label: 'Expenses',
      value: summary.expenses,
      hint: 'All debited amounts',
      icon: IconTrendDown,
      border: 'border-rose-200/60 dark:border-rose-500/25',
      gradient:
        'from-rose-500/12 via-white to-orange-500/10 dark:from-rose-500/15 dark:via-slate-900 dark:to-orange-500/10',
      iconBg: 'bg-rose-500/15 text-rose-700 dark:bg-rose-500/25 dark:text-rose-300',
      valueClass: 'text-slate-900 dark:text-rose-100',
    },
  ]

  return (
    <section aria-labelledby="summary-heading" className="grid gap-5 sm:grid-cols-3">
      <h2 id="summary-heading" className="sr-only">
        Financial summary
      </h2>
      {cards.map((c, i) => {
        const Icon = c.icon
        return (
          <article
            key={c.label}
            style={{ animationDelay: `${i * 60}ms` }}
            className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-md shadow-slate-900/[0.04] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/10 dark:shadow-black/30 dark:hover:shadow-violet-500/5 ${c.border} ${c.gradient}`}
          >
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-0 blur-2xl transition group-hover:opacity-100 dark:from-white/10"
              aria-hidden
            />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {c.label}
                </p>
                <p
                  className={`mt-3 font-mono text-3xl font-semibold tracking-tight tabular-nums ${c.valueClass}`}
                >
                  {formatCurrency(c.value)}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-500">{c.hint}</p>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${c.iconBg} transition group-hover:scale-105`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}

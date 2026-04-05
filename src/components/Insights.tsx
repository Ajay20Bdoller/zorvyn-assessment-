import { useMemo } from 'react'
import { formatCurrency } from '../lib/format'
import { selectExpenseByCategory, useFinanceStore } from '../store/useFinanceStore'

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function IconSpark() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
      />
    </svg>
  )
}

export function Insights() {
  const transactions = useFinanceStore((s) => s.transactions)

  const insight = useMemo(() => {
    const byCat = selectExpenseByCategory(transactions)
    const top = byCat[0]

    const now = new Date()
    const thisM = monthKey(now)
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevM = monthKey(prev)

    let thisIncome = 0
    let thisExpense = 0
    let prevIncome = 0
    let prevExpense = 0

    for (const t of transactions) {
      const m = t.date.slice(0, 7)
      if (m === thisM) {
        if (t.type === 'income') thisIncome += t.amount
        else thisExpense += t.amount
      } else if (m === prevM) {
        if (t.type === 'income') prevIncome += t.amount
        else prevExpense += t.amount
      }
    }

    const expenseDelta =
      prevExpense > 0 ? ((thisExpense - prevExpense) / prevExpense) * 100 : null
    const incomeDelta =
      prevIncome > 0 ? ((thisIncome - prevIncome) / prevIncome) * 100 : null

    const savingsRate =
      thisIncome > 0 ? ((thisIncome - thisExpense) / thisIncome) * 100 : null

    const observations: string[] = []
    if (top) {
      observations.push(
        `${top.name} is your highest spending category at ${formatCurrency(top.value)} total.`,
      )
    }
    if (expenseDelta !== null && prevExpense > 0) {
      observations.push(
        expenseDelta >= 0
          ? `This month’s spending is ${Math.abs(Math.round(expenseDelta))}% higher than last month.`
          : `This month’s spending is ${Math.abs(Math.round(expenseDelta))}% lower than last month.`,
      )
    } else if (prevExpense === 0 && thisExpense > 0) {
      observations.push('This is your first month with recorded expenses in the dataset.')
    }
    if (incomeDelta !== null && prevIncome > 0) {
      observations.push(
        incomeDelta >= 0
          ? `Income is up about ${Math.abs(Math.round(incomeDelta))}% vs last month.`
          : `Income is down about ${Math.abs(Math.round(incomeDelta))}% vs last month.`,
      )
    }
    if (savingsRate !== null && thisIncome > 0) {
      observations.push(
        `Approx. savings rate this month: ${Math.round(savingsRate)}% of income after expenses.`,
      )
    }

    return { top, observations }
  }, [transactions])

  return (
    <section
      className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white/90 to-violet-50/30 p-6 shadow-lg shadow-slate-900/[0.04] backdrop-blur-sm dark:border-slate-700/80 dark:from-slate-900/80 dark:to-violet-950/20 dark:shadow-black/40"
      aria-labelledby="insights-heading"
    >
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br from-violet-400/20 to-fuchsia-400/10 blur-2xl dark:from-violet-500/20" />
      <div className="relative flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30">
          <IconSpark />
        </div>
        <div>
          <h2
            id="insights-heading"
            className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Insights
          </h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            Quick takeaways from your data
          </p>
        </div>
      </div>

      {insight.observations.length === 0 ? (
        <p className="relative mt-6 rounded-xl border border-dashed border-slate-200 bg-white/50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/30 dark:text-slate-400">
          Add more activity to unlock insights.
        </p>
      ) : (
        <ul className="relative mt-5 space-y-3">
          {insight.observations.map((text) => (
            <li
              key={text}
              className="group flex gap-3 rounded-xl border border-slate-200/60 bg-white/70 p-3.5 text-sm leading-snug text-slate-700 shadow-sm transition hover:border-violet-200/80 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:border-violet-500/30"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-sm shadow-violet-500/50" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

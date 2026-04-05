import { useLayoutEffect } from 'react'
import { DashboardCharts } from './components/DashboardCharts'
import { Header } from './components/Header'
import { Insights } from './components/Insights'
import { SummaryCards } from './components/SummaryCards'
import { TransactionsPanel } from './components/TransactionsPanel'
import { useFinanceStore } from './store/useFinanceStore'

export default function App() {
  const darkMode = useFinanceStore((s) => s.darkMode)

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="app-shell relative pb-16">
      <div className="relative z-10">
        <Header />
        <main className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6 lg:py-12">
          <header className="animate-fade-up space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              Overview
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Your financial pulse
            </h2>
            <p className="max-w-xl text-sm text-slate-600 dark:text-slate-400">
              Balances, cash flow, and spending at a glance. Runs entirely in the browser.
            </p>
          </header>

          <div className="animate-fade-up-delay-1">
            <SummaryCards />
          </div>

          <section className="animate-fade-up-delay-2 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                Analytics
              </p>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Trends &amp; breakdown
              </h3>
            </div>
            <DashboardCharts />
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                Activity
              </p>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Ledger &amp; insights
              </h3>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TransactionsPanel />
              </div>
              <div className="lg:col-span-1">
                <Insights />
              </div>
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t border-slate-200/80 bg-white/40 py-6 text-center text-xs text-slate-500 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-500">
          Finance Dashboard · If the site does not open, run{' '}
          <code className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono text-[11px] dark:bg-slate-800">npm run dev</code>{' '}
          and use the <strong>Local</strong> URL printed in the terminal (port may not be 5173).
        </footer>
      </div>
    </div>
  )
}

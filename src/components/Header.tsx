import { useFinanceStore } from '../store/useFinanceStore'
import { exportTransactionsForDownload } from '../lib/exportCsv'

function IconSun() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  )
}

function IconMoon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  )
}

function IconDownload() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  )
}

export function Header() {
  const role = useFinanceStore((s) => s.role)
  const setRole = useFinanceStore((s) => s.setRole)
  const darkMode = useFinanceStore((s) => s.darkMode)
  const setDarkMode = useFinanceStore((s) => s.setDarkMode)
  const transactions = useFinanceStore((s) => s.transactions)

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/70 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/75 dark:shadow-black/20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <div
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-lg font-bold text-white shadow-lg shadow-violet-500/35 ring-2 ring-white/30 dark:ring-violet-400/20"
            aria-hidden
          >
            <span className="font-display tracking-tight">$</span>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-950" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
                Finance
              </span>{' '}
              <span className="text-slate-800 dark:text-white">Dashboard</span>
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Track activity &amp; spending patterns
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <label className="group flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-2 py-1.5 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/80">
            <span className="hidden pl-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:inline">
              Role
            </span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'viewer' | 'admin')}
              className="max-w-[10rem] cursor-pointer rounded-lg border-0 bg-transparent py-1 pl-1 pr-6 text-sm font-semibold text-slate-800 outline-none dark:text-slate-100"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-violet-500/50 dark:hover:text-violet-300"
            aria-pressed={darkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>

          <button
            type="button"
            onClick={() => exportTransactionsForDownload(transactions)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-violet-500/50 dark:hover:text-violet-300"
          >
            <IconDownload />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </header>
  )
}

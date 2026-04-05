import { useMemo } from 'react'
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { formatCurrency } from '../lib/format'
import {
  categoryColors,
  selectExpenseByCategory,
  selectMonthlyBuckets,
  useFinanceStore,
} from '../store/useFinanceStore'

const cardClass =
  'relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-lg shadow-slate-900/[0.04] backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/60 dark:shadow-black/40'

export function DashboardCharts() {
  const transactions = useFinanceStore((s) => s.transactions)
  const darkMode = useFinanceStore((s) => s.darkMode)
  const trend = useMemo(() => selectMonthlyBuckets(transactions), [transactions])
  const pieData = useMemo(() => selectExpenseByCategory(transactions), [transactions])
  const colors = useMemo(
    () => categoryColors(pieData.map((d) => d.name)),
    [pieData],
  )

  const gridStroke = darkMode ? '#334155' : '#e2e8f0'
  const tickFill = darkMode ? '#94a3b8' : '#64748b'
  const tooltipStyle = {
    borderRadius: 14,
    border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
    backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255,255,255,0.96)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    padding: '10px 14px',
  }

  const emptyTrend = trend.length === 0
  const emptyPie = pieData.length === 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <section className={`${cardClass} lg:col-span-3`} aria-labelledby="trend-heading">
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-teal-400 opacity-90" />
        <h2
          id="trend-heading"
          className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white"
        >
          Balance trend
        </h2>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          End-of-month balance after each period
        </p>
        {emptyTrend ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No timeline yet</p>
            <p className="max-w-xs text-xs text-slate-500">
              Add transactions to see your balance evolve month over month.
            </p>
          </div>
        ) : (
          <div className="mt-4 h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: tickFill }}
                  axisLine={false}
                  tickLine={false}
                  dy={6}
                />
                <YAxis
                  tickFormatter={(v) => `$${v / 1000}k`}
                  tick={{ fontSize: 11, fill: tickFill }}
                  axisLine={false}
                  tickLine={false}
                  dx={-4}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value ?? 0))}
                  contentStyle={tooltipStyle}
                  labelStyle={{
                    fontWeight: 600,
                    marginBottom: 4,
                    color: darkMode ? '#e2e8f0' : '#1e293b',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Balance"
                  stroke="url(#lineGrad)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className={`${cardClass} lg:col-span-2`} aria-labelledby="breakdown-heading">
        <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-violet-500 to-fuchsia-500 opacity-90" />
        <h2
          id="breakdown-heading"
          className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white"
        >
          Spending by category
        </h2>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Expense totals across your ledger
        </p>
        {emptyPie ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No expenses yet</p>
            <p className="max-w-xs text-xs text-slate-500">Expense entries will appear in this chart.</p>
          </div>
        ) : (
          <div className="mt-2 h-56 w-full min-w-0 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  cornerRadius={4}
                >
                  {pieData.map((row) => (
                    <Cell key={row.name} fill={colors[row.name]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value ?? 0))}
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        {!emptyPie && (
          <ul className="mt-1 flex flex-wrap gap-2">
            {pieData.map((d) => (
              <li
                key={d.name}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
              >
                <span
                  className="h-2 w-2 rounded-full shadow-sm"
                  style={{ backgroundColor: colors[d.name] }}
                />
                {d.name}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

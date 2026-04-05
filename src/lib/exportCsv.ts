import type { Transaction } from '../types/finance'

export function transactionsToCsv(rows: Transaction[]): string {
  const header = ['Date', 'Amount', 'Category', 'Type', 'Note']
  const lines = rows.map((t) =>
    [
      t.date,
      String(t.amount),
      escapeCsv(t.category),
      t.type,
      escapeCsv(t.note ?? ''),
    ].join(','),
  )
  return [header.join(','), ...lines].join('\n')
}

function escapeCsv(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportTransactionsForDownload(rows: Transaction[]): void {
  const csv = transactionsToCsv(
    [...rows].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  )
  const stamp = new Date().toISOString().slice(0, 10)
  downloadCsv(`transactions-${stamp}.csv`, csv)
}

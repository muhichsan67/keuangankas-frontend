/**
 * Format a number as Indonesian Rupiah string.
 * @param {number|string} value
 * @returns {string}  e.g. "Rp 1.250.000"
 */
export function formatRupiah(value) {
  const num = Number(value) || 0
  return 'Rp ' + num.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

/**
 * Parse a Rupiah-formatted string back to a number.
 * @param {string} str
 * @returns {number}
 */
export function parseRupiah(str) {
  if (!str) return 0
  return Number(String(str).replace(/[^\d]/g, '')) || 0
}

/**
 * Format a date string to Indonesian locale display.
 * @param {string} dateStr  ISO date string
 * @param {object} opts     Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  })
}

/**
 * Format date to relative time (e.g. "2 jam lalu", "Kemarin").
 * @param {string} dateStr
 * @returns {string}
 */
export function formatRelative(dateStr) {
  if (!dateStr) return '-'
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now - date
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Baru saja'
  if (diffMin < 60) return `${diffMin} menit lalu`
  if (diffHour < 24) return `${diffHour} jam lalu`
  if (diffDay === 1) return 'Kemarin'
  if (diffDay < 7) return `${diffDay} hari lalu`
  return formatDate(dateStr)
}

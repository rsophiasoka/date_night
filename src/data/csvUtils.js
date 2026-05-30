// Parses a raw CSV string into an array of objects using the header row as keys
export function parseCSV(raw) {
  const lines = raw.trim().split('\n')
  const headers = parseRow(lines[0])

  return lines.slice(1).map((line) => {
    const values = parseRow(line)
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (values[i] ?? '').trim()]))
  })
}

// Handles quoted fields that may contain commas
function parseRow(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

// Filters activity rows by time_of_day and min_spend, then picks 6 at random
export function pickRandom6(rows, { time, money } = {}) {
  let filtered = rows

  if (time) {
    filtered = filtered.filter(
      (r) => !r.time_of_day || r.time_of_day === 'All Day' || r.time_of_day === time
    )
  }

  if (money !== undefined) {
    filtered = filtered.filter((r) => {
      const minSpend = parseInt(r.min_spend ?? '0', 10)
      return minSpend <= parseInt(money, 10)
    })
  }

  // Shuffle and take first 6
  const shuffled = [...filtered].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 6)
}

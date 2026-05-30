import { useState, useMemo } from 'react'
import rawCSV from '../data/FreeActivitySuggestions.csv?raw'
import { parseCSV, pickRandom6 } from '../data/csvUtils'
import ResultsPage from './ResultsPage'

const allRows = parseCSV(rawCSV)

function FreeActivitySuggestions({ answers }) {
  const filters = { time: answers.time, money: answers.money ?? '0' }

  const [items, setItems] = useState(() => pickRandom6(allRows, filters))

  function regenerate() {
    setItems(pickRandom6(allRows, filters))
  }

  return (
    <ResultsPage
      title="Free things to do! 🆓"
      subtitle={`${answers.city} · ${answers.time}`}
      items={items}
      onRegenerate={regenerate}
      nameKey="activity_name"
      descriptionKey="description"
      extraKey="format"
    />
  )
}

export default FreeActivitySuggestions

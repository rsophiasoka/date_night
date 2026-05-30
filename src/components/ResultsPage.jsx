import ResultCard from './ResultCard'

function ResultsPage({ title, subtitle, items, onRegenerate, nameKey, descriptionKey, extraKey }) {
  if (items.length === 0) {
    return (
      <div className="question">
        <h2>{title}</h2>
        <p>Hmm, nothing matched your filters. Try going back and changing your answers!</p>
      </div>
    )
  }

  return (
    <div className="question">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}

      <div className="results-grid">
        {items.map((item, i) => (
          <ResultCard
            key={i}
            name={item[nameKey]}
            description={item[descriptionKey]}
            extra={extraKey ? item[extraKey] : null}
          />
        ))}
      </div>

      <button className="regenerate-button" onClick={onRegenerate}>
        🎲 Try 6 different ones
      </button>
    </div>
  )
}

export default ResultsPage

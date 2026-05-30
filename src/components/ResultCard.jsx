import { useState } from 'react'

function ResultCard({ name, description, extra }) {
  const [open, setOpen] = useState(false)

  // If name and description are the same, this is a question card — no expand needed
  const isQuestion = name === description

  return (
    <div
      className={`result-card ${open ? 'open' : ''} ${isQuestion ? 'question-card' : ''}`}
      onClick={() => setOpen(!open)}
    >
      <div className="result-card-name">{name}</div>

      {!isQuestion && open && (
        <div className="result-card-description">
          <p>{description}</p>
          {extra && <p className="result-card-extra">{extra}</p>}
        </div>
      )}

      {!isQuestion && (
        <div className="result-card-hint">{open ? '▲ close' : '▼ details'}</div>
      )}
    </div>
  )
}

export default ResultCard

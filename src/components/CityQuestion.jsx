import { useState } from 'react'

function CityQuestion({ onAnswer, onExplode }) {
  const [customCity, setCustomCity] = useState('')

  return (
    <div className="question">
      <h2>Yay! What city are you in?</h2>

      <div className="choices">
        <button onClick={(e) => { onExplode(e); onAnswer('Chicago') }}>Chicago 🌆</button>
        <button onClick={(e) => { onExplode(e); onAnswer('Boston') }}>Boston 🦞</button>
      </div>

      <p style={{ marginTop: '20px' }}>Somewhere else?</p>
      <div className="custom-city">
        <input
          type="text"
          placeholder="Type your city..."
          value={customCity}
          onChange={(e) => setCustomCity(e.target.value)}
        />
        <button
          onClick={(e) => { onExplode(e); onAnswer(customCity) }}
          disabled={customCity.trim() === ''}
        >
          Go
        </button>
      </div>
    </div>
  )
}

export default CityQuestion

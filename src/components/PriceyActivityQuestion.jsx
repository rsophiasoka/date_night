function PriceyActivityQuestion({ answers, onAnswer, onExplode }) {
  const { city, time, money } = answers

  return (
    <div className="question">
      <h2>Let's find something to do!</h2>

      <p>Here's what we know so far:</p>
      <ul style={{ listStyle: 'none', padding: '8px 0 16px', lineHeight: '2' }}>
        <li>📍 City: <strong>{city}</strong></li>
        <li>🕐 Time: <strong>{time}</strong></li>
        <li>💸 Budget: <strong>${money}</strong></li>
      </ul>

      <p>What kind of activity sounds good?</p>
      <div className="choices">
        <button onClick={(e) => { onExplode(e); onAnswer('food') }}>Food & Drinks 🍽️</button>
        <button onClick={(e) => { onExplode(e); onAnswer('experience') }}>Experience / Event 🎭</button>
        <button onClick={(e) => { onExplode(e); onAnswer('outdoors') }}>Outdoors 🌿</button>
        <button onClick={(e) => { onExplode(e); onAnswer('surprise') }}>Surprise me! 🎲</button>
      </div>
    </div>
  )
}

export default PriceyActivityQuestion

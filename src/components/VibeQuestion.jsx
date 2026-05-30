function VibeQuestion({ onAnswer, onExplode }) {
  return (
    <div className="question">
      <h2>What's your vibe tonight?</h2>
      <p>How are you two feeling?</p>
      <div className="choices">
        <button onClick={(e) => { onExplode(e); onAnswer('chill') }}>Chill 🛋️</button>
        <button onClick={(e) => { onExplode(e); onAnswer('active') }}>Active 🎯</button>
      </div>
    </div>
  )
}

export default VibeQuestion

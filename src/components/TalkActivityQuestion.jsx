function TalkActivityQuestion({ onAnswer, onExplode }) {
  return (
    <div className="question">
      <h2>How do you want to connect?</h2>
      <p>Pick your vibe for the night</p>
      <div className="choices">
        <button onClick={(e) => { onExplode(e); onAnswer('game') }}>Play a Game 🎮</button>
        <button onClick={(e) => { onExplode(e); onAnswer('questions') }}>Answer Questions 💬</button>
      </div>
    </div>
  )
}

export default TalkActivityQuestion

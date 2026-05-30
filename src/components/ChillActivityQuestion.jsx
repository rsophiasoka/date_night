function ChillActivityQuestion({ onAnswer, onExplode }) {
  return (
    <div className="question">
      <h2>What kind of chill?</h2>
      <p>Do you want to watch something or hang out and talk?</p>
      <div className="choices">
        <button onClick={(e) => { onExplode(e); onAnswer('watch') }}>Watch Something 🍿</button>
        <button onClick={(e) => { onExplode(e); onAnswer('talk') }}>Talk to Each Other 💬</button>
      </div>
    </div>
  )
}

export default ChillActivityQuestion

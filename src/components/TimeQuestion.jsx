function TimeQuestion({ onAnswer, onExplode }) {
  return (
    <div className="question">
      <h2>What time of day is it?</h2>
      <p>This helps us find things that are actually open!</p>
      <div className="choices">
        <button onClick={(e) => { onExplode(e); onAnswer('all day') }}>All Day ☀️</button>
        <button onClick={(e) => { onExplode(e); onAnswer('daytime') }}>Daytime 🌤️</button>
        <button onClick={(e) => { onExplode(e); onAnswer('evening') }}>Evening 🌆</button>
        <button onClick={(e) => { onExplode(e); onAnswer('night') }}>Late Night 🌙</button>
      </div>
    </div>
  )
}

export default TimeQuestion

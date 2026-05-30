function LocationQuestion({ onAnswer, onExplode }) {
  return (
    <div className="question">
      <h2>First things first...</h2>
      <p>Are you two together tonight or doing this over FaceTime?</p>
      <div className="choices">
        <button onClick={(e) => { onExplode(e); onAnswer('together') }}>Together 🥰</button>
        <button onClick={(e) => { onExplode(e); onAnswer('apart') }}>Apart 💻</button>
      </div>
    </div>
  )
}

export default LocationQuestion

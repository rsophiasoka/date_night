function MealQuestion({ onAnswer }) {
  return (
    <div className="question">
      <h2>Have you eaten?</h2>
      <p>Want to grab a bite?</p>

      <div className="choices">
        <button onClick={() => onAnswer('yes')}>
          Yes
        </button>
        <button onClick={() => onAnswer('no')}>
          No
        </button>
      </div>
    </div>
  )
}

export default MealQuestion
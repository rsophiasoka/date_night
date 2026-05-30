import { useState } from 'react'

function MoneyQuestion({ onAnswer, onExplode }) {
  const [wantsToSpend, setWantsToSpend] = useState(null)

  return (
    <div className="question">
      <h2>Do you want to spend money?</h2>

      <div className="choices">
        <button onClick={(e) => { onExplode(e); setWantsToSpend(true) }}>Yes 💸</button>
        <button onClick={(e) => { onExplode(e); onAnswer('0') }}>No thanks 🆓</button>
      </div>

      {wantsToSpend && (
        <>
          <p style={{ marginTop: '20px' }}>How much are you willing to spend?</p>
          <div className="choices">
            <button onClick={(e) => { onExplode(e); onAnswer('30') }}>~$20</button>
            <button onClick={(e) => { onExplode(e); onAnswer('60') }}>~$50</button>
            <button onClick={(e) => { onExplode(e); onAnswer('100') }}>~$100</button>
          </div>
        </>
      )}
    </div>
  )
}

export default MoneyQuestion

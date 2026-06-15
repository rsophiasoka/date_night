export default function WheelPickerPage({ setPage }) {
  return (
    <div className="wheel-picker-page">
      <button className="home-button" onClick={() => setPage('home')}>HOME</button>

      <h1 className="sax-title" style={{ fontSize: '3rem', marginTop: '80px' }}>
        Whose wheel? 🎡
      </h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '40px' }}>
        Pick a person to spin for
      </p>

      <div className="picker-choices">
        <button
          className="picker-btn"
          style={{ background: 'var(--pink)' }}
          onClick={() => setPage('sophia')}
        >
          Sophia
        </button>
        <button
          className="picker-btn"
          style={{ background: 'var(--blue)' }}
          onClick={() => setPage('max')}
        >
          Max
        </button>
      </div>
    </div>
  )
}

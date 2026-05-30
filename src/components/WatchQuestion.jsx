import { useState } from 'react'

const GENRES = ['Romance', 'Comedy', 'Horror', 'Action', 'Drama', 'Sci-Fi', 'Documentary']
const SPECIAL = ['New Releases 🆕', 'Surprise Me 🎲']

function WatchQuestion({ onAnswer, onExplode }) {
  const [format, setFormat] = useState('')
  const [genres, setGenres] = useState([])
  const [keywords, setKeywords] = useState('')

  function toggleGenre(g) {
    // Special options are exclusive — clear everything else when picked
    if (SPECIAL.includes(g)) {
      setGenres([g])
      return
    }
    // Picking a regular genre clears any special option that was selected
    setGenres((prev) => {
      const withoutSpecial = prev.filter((x) => !SPECIAL.includes(x))
      return withoutSpecial.includes(g)
        ? withoutSpecial.filter((x) => x !== g)   // deselect
        : [...withoutSpecial, g]                   // select
    })
  }

  function handleSubmit() {
    onAnswer({ format, genres, keywords })
  }

  const readyToSubmit = format !== '' && genres.length > 0

  return (
    <div className="question">
      <h2>What do you want to watch?</h2>

      <p>Movie or series?</p>
      <div className="choices">
        {['Movie 🎬', 'Series 📺'].map((label) => {
          const value = label.includes('Movie') ? 'movie' : 'series'
          return (
            <button
              key={value}
              onClick={(e) => { if (onExplode) onExplode(e); setFormat(value) }}
              style={{ opacity: format === value ? 1 : 0.4 }}
            >
              {label}
            </button>
          )
        })}
      </div>

      <p style={{ marginTop: '20px' }}>Pick your genres — you can pick more than one!</p>
      <div className="choices">
        {[...GENRES, ...SPECIAL].map((g) => (
          <button
            key={g}
            onClick={() => toggleGenre(g)}
            style={{ opacity: genres.includes(g) ? 1 : 0.4 }}
          >
            {g}
          </button>
        ))}
      </div>

      <p style={{ marginTop: '20px' }}>Any keywords? (optional)</p>
      <input
        type="text"
        placeholder="e.g. time travel, based on a book..."
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSubmit} disabled={!readyToSubmit}>
          Find something to watch 🍿
        </button>
      </div>
    </div>
  )
}

export default WatchQuestion

import { useState, useEffect } from 'react'

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY
const IMG_BASE = 'https://image.tmdb.org/t/p/w300'

// TMDB genre IDs for movies and series
const MOVIE_GENRE_IDS = {
  Romance: 10749, Comedy: 35, Horror: 27,
  Action: 28, Drama: 18, 'Sci-Fi': 878, Documentary: 99,
}
const TV_GENRE_IDS = {
  Romance: 10749, Comedy: 35, Horror: 9648,
  Action: 10759, Drama: 18, 'Sci-Fi': 10765, Documentary: 99,
}

async function fetchTMDB({ format, genres, keywords }) {
  const isMovie = format === 'movie'
  const endpoint = isMovie ? 'movie' : 'tv'
  const genreMap = isMovie ? MOVIE_GENRE_IDS : TV_GENRE_IDS
  const isSurprise = genres.includes('Surprise Me 🎲')
  const isNew = genres.includes('New Releases 🆕')

  const params = new URLSearchParams({
    api_key:            TMDB_KEY,
    language:           'en-US',
    include_adult:      'false',
    'vote_count.gte':   '50',
    page:               String(Math.floor(Math.random() * 5) + 1),
  })

  if (!isSurprise) {
    const regularGenres = genres.filter((g) => !['New Releases 🆕', 'Surprise Me 🎲'].includes(g))
    if (regularGenres.length > 0) {
      // OR logic: comma-separated in TMDB = match any genre
      params.set('with_genres', regularGenres.map((g) => genreMap[g]).filter(Boolean).join(','))
    }
  }

  if (isNew) {
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const dateKey = isMovie ? 'primary_release_date.gte' : 'first_air_date.gte'
    params.set(dateKey, oneYearAgo.toISOString().split('T')[0])
    params.set('sort_by', 'release_date.desc')
  } else {
    params.set('sort_by', 'popularity.desc')
  }

  if (keywords) {
    // Search by keyword using TMDB keyword search first
    params.set('query', keywords)
    const searchRes = await fetch(`https://api.themoviedb.org/3/search/${endpoint}?${params}`)
    const searchData = await searchRes.json()
    return searchData.results ?? []
  }

  const res = await fetch(`https://api.themoviedb.org/3/discover/${endpoint}?${params}`)
  const data = await res.json()
  return data.results ?? []
}

function WatchResults({ answers }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const results = await fetchTMDB(answers.watch)
      const shuffled = [...results].sort(() => Math.random() - 0.5).slice(0, 6)
      setItems(shuffled)
    } catch (e) {
      setError('Could not load results. Check your TMDB key.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="question"><h2>Finding something to watch... 🍿</h2></div>
  if (error)   return <div className="question"><p>{error}</p></div>

  return (
    <div className="question">
      <h2>Here's what to watch! 🎬</h2>
      <p>{answers.watch.format === 'movie' ? 'Movies' : 'Series'} · {answers.watch.genres.join(', ')}</p>

      <div className="media-grid">
        {items.map((item) => {
          const title = item.title ?? item.name
          const type = answers.watch.format === 'movie' ? 'movie' : 'TV series'
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + type + ' IMDB')}`
          return (
            <a key={item.id} className="media-card" href={searchUrl} target="_blank" rel="noreferrer">
              {item.poster_path
                ? <img src={`${IMG_BASE}${item.poster_path}`} alt={title} />
                : <div className="media-card-no-poster">No poster</div>
              }
              <div className="media-card-info">
                <div className="media-card-title">{title}</div>
                <div className="media-card-rating">⭐ {item.vote_average?.toFixed(1)}</div>
              </div>
            </a>
          )
        })}
      </div>

      <button className="regenerate-button" onClick={load}>🎲 Show me 6 more</button>
    </div>
  )
}

export default WatchResults

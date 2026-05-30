import { useState, useEffect } from 'react'

async function fetchActivities({ city, money, activityType }) {
  const params = new URLSearchParams({ city, money, activityType })
  const res = await fetch(`http://localhost:3001/api/activities?${params}`)
  if (!res.ok) throw new Error('Could not load activities')
  return res.json()
}

function PriceyResults({ answers }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const results = await fetchActivities({
        city:         answers.city,
        money:        answers.money,
        activityType: answers.activityType,
      })
      setItems(results)
    } catch (e) {
      setError('Could not load activities. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="question"><h2>Finding things to do... 🗺️</h2></div>
  if (error)   return <div className="question"><p>{error}</p></div>
  if (items.length === 0) return (
    <div className="question">
      <h2>Nothing found nearby 😅</h2>
      <p>Try going back and picking a different activity type or budget.</p>
    </div>
  )

  return (
    <div className="question">
      <h2>Things to do in {answers.city}! 📍</h2>
      <p>{answers.activityType} · Budget ${answers.money} · {answers.time}</p>

      <div className="yelp-grid">
        {items.map((biz) => (
          <a
            key={biz.id}
            className="yelp-card"
            href={biz.url}
            target="_blank"
            rel="noreferrer"
          >
            {biz.image_url
              ? <img src={biz.image_url} alt={biz.name} />
              : <div className="yelp-card-no-image">📍</div>
            }
            <div className="yelp-card-info">
              <div className="yelp-card-name">{biz.name}</div>
              <div className="yelp-card-meta">
                ⭐ {biz.rating} &nbsp;·&nbsp; {'$'.repeat(biz.price?.length ?? 1)}
              </div>
              <div className="yelp-card-category">
                {biz.categories?.[0]?.title}
              </div>
            </div>
          </a>
        ))}
      </div>

      <button className="regenerate-button" onClick={load}>🎲 Show me 6 more</button>
    </div>
  )
}

export default PriceyResults

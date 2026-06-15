import { useState, useEffect } from 'react'

async function fetchActivities({ city, money, time, activityType }) {
  const params = new URLSearchParams({ city, money, time, activityType })
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
        time:         answers.time,
        activityType: answers.activityType,
      })
      setItems(results)
    } catch (e) {
      setError('Could not load suggestions. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return (
    <div className="question">
      <h2>Claude is thinking... ✨</h2>
      <p>Finding the perfect activities for your night</p>
    </div>
  )

  if (error) return (
    <div className="question">
      <h2>Something went wrong 😅</h2>
      <p>{error}</p>
    </div>
  )

  return (
    <div className="question">
      <h2>Here's what to do! 🎯</h2>
      <p>{answers.city} · {answers.time} · ${answers.money} budget</p>

      <div className="claude-grid">
        {items.map((item, i) => (
          <div key={i} className="claude-card">
            <div className="claude-card-emoji">{item.emoji}</div>
            <div className="claude-card-body">
              <div className="claude-card-name">{item.name}</div>
              <div className="claude-card-desc">{item.description}</div>
              <div className="claude-card-why">💡 {item.why}</div>
              <div className="claude-card-cost">{item.cost}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="regenerate-button" onClick={load}>🎲 Give me 6 more ideas</button>
    </div>
  )
}

export default PriceyResults

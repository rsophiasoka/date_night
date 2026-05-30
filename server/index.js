import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env') })
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))

const YELP_KEY = process.env.YELP_KEY

// Maps the activityType answer to Yelp category strings
const CATEGORY_MAP = {
  food:       'restaurants,bars,cafes',
  experience: 'arts,entertainment,museums,theaters',
  outdoors:   'parks,hiking,gardens,beaches',
  surprise:   'active,arts,restaurants,entertainment',
}

// Maps money answer to Yelp price tiers (1=$, 2=$$, 3=$$$, 4=$$$$)
function priceTiers(money) {
  if (money === '30')  return '1,2'
  if (money === '60')  return '1,2,3'
  if (money === '100') return '1,2,3,4'
  return '1'
}

app.get('/api/activities', async (req, res) => {
  const { city, money, activityType } = req.query

  const params = new URLSearchParams({
    location:   city || 'Boston',
    categories: CATEGORY_MAP[activityType] ?? CATEGORY_MAP.surprise,
    price:      priceTiers(money),
    limit:      '20',
    sort_by:    'rating',
    open_now:   'true',
  })

  try {
    const response = await fetch(`https://api.yelp.com/v3/businesses/search?${params}`, {
      headers: { Authorization: `Bearer ${YELP_KEY}` },
    })
    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.description ?? 'Yelp error' })
    }

    // Shuffle and return 6
    const shuffled = data.businesses.sort(() => Math.random() - 0.5).slice(0, 6)
    res.json(shuffled)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('Server running on http://localhost:3001'))

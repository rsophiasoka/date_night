import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env') })

import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

const app    = express()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.use(cors({ origin: 'http://localhost:5173' }))

app.get('/api/activities', async (req, res) => {
  const { city, money, time, activityType } = req.query

  const budgetLabel = {
    '0':   'free (no spend)',
    '30':  'around $20–30 per person',
    '60':  'around $50–60 per person',
    '100': 'around $100 per person',
  }[money] ?? 'flexible budget'

  const timeLabel = {
    'all day': 'any time of day',
    daytime:   'during the day',
    evening:   'in the evening',
    night:     'late at night',
  }[time] ?? time

  const activityLabel = {
    food:       'food and drinks',
    experience: 'an experience or event',
    outdoors:   'something outdoors',
    surprise:   'anything fun — surprise us',
  }[activityType] ?? activityType

  const prompt = `You are a creative date night planner. Suggest 6 specific, concrete date night activities for a couple.

Details:
- City: ${city || 'any city'}
- Time of day: ${timeLabel}
- Budget: ${budgetLabel}
- Looking for: ${activityLabel}

Return a JSON array of exactly 6 activities. Each activity must have:
- "name": short catchy name (max 5 words)
- "description": one sentence of what you actually do
- "why": one sentence on why it's great for this vibe
- "cost": realistic cost estimate (e.g. "Free", "$15/person", "$40 total")
- "emoji": a single relevant emoji

Only return the JSON array, no other text. Make suggestions specific to ${city || 'the city'} where possible.`

  try {
    const response = await client.messages.create({
      model:      'claude-opus-4-8',
      max_tokens: 1024,
      thinking:   { type: 'adaptive' },
      messages:   [{ role: 'user', content: prompt }],
    })

    // Extract the text block from the response
    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock) throw new Error('No text in response')

    // Strip markdown code fences if Claude wrapped the JSON in them
    const cleaned = textBlock.text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()

    // Parse the JSON array Claude returned
    const activities = JSON.parse(cleaned)
    res.json(activities)
  } catch (err) {
    console.error('Claude error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('🚀 Server running on http://localhost:3001'))

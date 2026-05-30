import { useState } from 'react'
import rawGames from '../data/TalkActivityGames.csv?raw'
import rawQuestions from '../data/TalkActivityQuestions.csv?raw'
import { parseCSV, pickRandom6 } from '../data/csvUtils'
import ResultsPage from './ResultsPage'

const allGames = parseCSV(rawGames)
const allQuestions = parseCSV(rawQuestions)

function TalkResults({ answers }) {
  const isGame = answers.talkActivity === 'game'
  const allRows = isGame ? allGames : allQuestions

  const [items, setItems] = useState(() => pickRandom6(allRows))

  function regenerate() {
    setItems(pickRandom6(allRows))
  }

  if (isGame) {
    return (
      <ResultsPage
        title="Games to play! 🎮"
        items={items}
        onRegenerate={regenerate}
        nameKey="game_name"
        descriptionKey="description"
        extraKey="platform"
      />
    )
  }

  return (
    <ResultsPage
      title="Questions to ask each other 💬"
      items={items}
      onRegenerate={regenerate}
      nameKey="question"
      descriptionKey="question"
    />
  )
}

export default TalkResults

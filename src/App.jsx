import { useState } from 'react'
import { useEmojiExplosion } from './components/EmojiExplosion'
import WheelPage from './pages/WheelPage'
import { MAX_ITEMS, SOPHIA_ITEMS } from './data/wheelData'
import VibeQuestion from './components/VibeQuestion'
import LocationQuestion from './components/LocationQuestion'
import CityQuestion from './components/CityQuestion'
import ChillActivityQuestion from './components/ChillActivityQuestion'
import WatchQuestion from './components/WatchQuestion'
import WatchResults from './components/WatchResults'
import TalkActivityQuestion from './components/TalkActivityQuestion'
import TalkResults from './components/TalkResults'
import MoneyQuestion from './components/MoneyQuestion'
import TimeQuestion from './components/TimeQuestion'
import PriceyActivityQuestion from './components/PriceyActivityQuestion'
import PriceyResults from './components/PriceyResults'
import FreeActivitySuggestions from './components/FreeActivitySuggestions'
import ActiveApartSuggestions from './components/ActiveApartSuggestions'
import './App.css'

function App() {
  const [answers, setAnswers] = useState({})
  const [currentScreen, setCurrentScreen] = useState('vibe')
  const { trigger: explode, elements: explosionElements } = useEmojiExplosion()

  // history is a stack of { screen, key } — one entry per step forward taken
  // when we go back, we pop the last entry and delete that key from answers
  const [history, setHistory] = useState([])

  function handleAnswer(key, value, nextScreen) {
    setHistory((prev) => [...prev, { screen: currentScreen, key }])
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setCurrentScreen(nextScreen)
  }

  function handleBack() {
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setAnswers((a) => {
      const updated = { ...a }
      delete updated[prev.key]
      return updated
    })
    setCurrentScreen(prev.screen)
  }

  const canGoBack = history.length > 0
  const [page, setPage] = useState('quiz')

  if (page === 'max')    return <WheelPage name="Max"    initialItems={MAX_ITEMS}    onBack={() => setPage('quiz')} />
  if (page === 'sophia') return <WheelPage name="Sophia" initialItems={SOPHIA_ITEMS} onBack={() => setPage('quiz')} />

  return (
    <div className="app">
      <div className="header-emoji"></div>
      <h1>
        <span className="secret-name" onClick={() => setPage('max')}>Max</span>
        {' and '}
        <span className="secret-name" onClick={() => setPage('sophia')}>Sophia</span>
        {' are going on a date!'}
      </h1>
      <p>Let's figure out what y'all should do together</p>

      {currentScreen === 'vibe' && (
        <VibeQuestion onExplode={explode} onAnswer={(value) =>
          handleAnswer('vibe', value, 'location')
        } />
      )}

      {currentScreen === 'location' && (
        <LocationQuestion onExplode={explode} onAnswer={(value) => {
          if (answers.vibe === 'chill') {
            handleAnswer('location', value, 'chillActivity')
          } else if (value === 'together') {
            handleAnswer('location', value, 'city')
          } else {
            handleAnswer('location', value, 'money')
          }
        }} />
      )}

      {currentScreen === 'city' && (
        <CityQuestion onExplode={explode} onAnswer={(value) =>
          handleAnswer('city', value, 'money')
        } />
      )}

      {currentScreen === 'chillActivity' && (
        <ChillActivityQuestion onExplode={explode} onAnswer={(value) =>
          handleAnswer('chillActivity', value, value === 'watch' ? 'watch' : 'talk')
        } />
      )}

      {currentScreen === 'watch' && (
        <WatchQuestion onExplode={explode} onAnswer={(value) =>
          handleAnswer('watch', value, 'watchResults')
        } />
      )}

      {currentScreen === 'watchResults' && (
        <WatchResults answers={answers} />
      )}

      {currentScreen === 'talk' && (
        <TalkActivityQuestion onExplode={explode} onAnswer={(value) =>
          handleAnswer('talkActivity', value, 'talkResults')
        } />
      )}

      {currentScreen === 'talkResults' && (
        <TalkResults answers={answers} />
      )}

      {currentScreen === 'money' && (
        <MoneyQuestion onExplode={explode} onAnswer={(value) =>
          handleAnswer('money', value, 'time')
        } />
      )}

      {currentScreen === 'time' && (
        <TimeQuestion onExplode={explode} onAnswer={(value) => {
          if (answers.location === 'apart') {
            handleAnswer('time', value, 'apartSuggestions')
          } else if (answers.money === '0') {
            handleAnswer('time', value, 'freeActivity')
          } else {
            handleAnswer('time', value, 'activityType')
          }
        }} />
      )}

      {currentScreen === 'activityType' && (
        <PriceyActivityQuestion
          answers={answers}
          onExplode={explode}
          onAnswer={(value) =>
            handleAnswer('activityType', value, answers.money === '0' ? 'freeActivity' : 'priceyResults')
          }
        />
      )}

      {currentScreen === 'freeActivity' && (
        <FreeActivitySuggestions answers={answers} />
      )}

      {currentScreen === 'priceyResults' && (
        <PriceyResults answers={answers} />
      )}

      {currentScreen === 'apartSuggestions' && (
        <ActiveApartSuggestions answers={answers} />
      )}

      {canGoBack && (
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
      )}

      {explosionElements}
    </div>
  )
}

export default App

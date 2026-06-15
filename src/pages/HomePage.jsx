const CARDS = [
  {
    title:  'Date Night Planner',
    color:  'var(--pink)',
    emojis: ['🎪', '🪸', '🧃'],
    action: 'quiz',
  },
  {
    title:  'Spin the Wheel',
    color:  'var(--blue)',
    emojis: ['🦕', '🧁', '🪬'],
    action: 'wheelPicker',
  },
  {
    title:  'Mahoot',
    color:  'var(--yellow)',
    emojis: ['🎭', '🫐', '🛸'],
    action: null,
  },
  {
    title:  'Queue',
    color:  'var(--green)',
    emojis: ['🦚', '🧲', '🎯'],
    action: null,
  },
  {
    title:  'Add Later',
    color:  'var(--orange)',
    emojis: ['🪄', '🐙', '🌮'],
    action: null,
  },
  {
    title:  'Add Later',
    color:  'var(--purple)',
    emojis: ['🦜', '🧊', '🎺'],
    action: null,
  },
]

export default function HomePage({ setPage }) {
  return (
    <div className="home-page">
      <h1 className="sax-title">SAX</h1>
      <p className="sax-tagline">The site where Max and Sophia execute silly ideas</p>

      <div className="home-grid">
        {CARDS.map((card, i) => (
          <div
            key={i}
            className={`home-card ${!card.action ? 'home-card--inactive' : ''}`}
            style={{ background: card.color }}
            onClick={() => card.action && setPage(card.action)}
          >
            {/* Emojis above the title */}
            <div className="home-card-emojis-top">
              <span style={{ transform: 'rotate(-12deg)', display: 'inline-block' }}>{card.emojis[0]}</span>
              <span style={{ transform: 'rotate(10deg)',  display: 'inline-block' }}>{card.emojis[1]}</span>
            </div>

            <div className="home-card-title">{card.title}</div>

            {/* Emoji below the title */}
            <div className="home-card-emojis-bottom">
              <span style={{ transform: 'rotate(-6deg)', display: 'inline-block' }}>{card.emojis[2]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

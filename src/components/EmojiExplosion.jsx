import { useState, useCallback } from 'react'

const EMOJIS = ['💕', '✨', '🌈', '🎉', '💫', '🌟', '🎊', '💖', '🦋', '🍓', '🌸', '🎈', '💥', '🪄', '🌙', '⭐', '🍕', '🎶', '🦄', '🍦']

// Returns a trigger function and the explosion elements to render
export function useEmojiExplosion() {
  const [explosions, setExplosions] = useState([])

  const trigger = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    // Pick 8 random emojis for this burst
    const particles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      // Each particle flies in a different direction
      angle: (360 / 8) * i + Math.random() * 20,
      distance: 60 + Math.random() * 50,
    }))

    const explosion = { id: Date.now(), x, y, particles }
    setExplosions((prev) => [...prev, explosion])

    // Remove after animation finishes
    setTimeout(() => {
      setExplosions((prev) => prev.filter((e) => e.id !== explosion.id))
    }, 700)
  }, [])

  const elements = (
    <>
      {explosions.map((explosion) => (
        <div key={explosion.id}>
          {explosion.particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180
            const tx = Math.cos(rad) * p.distance
            const ty = Math.sin(rad) * p.distance
            return (
              <span
                key={p.id}
                className="emoji-particle"
                style={{
                  left: explosion.x,
                  top: explosion.y,
                  '--tx': `${tx}px`,
                  '--ty': `${ty}px`,
                }}
              >
                {p.emoji}
              </span>
            )
          })}
        </div>
      ))}
    </>
  )

  return { trigger, elements }
}

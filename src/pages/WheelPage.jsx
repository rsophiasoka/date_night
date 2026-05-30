import { useRef, useEffect, useState } from 'react'

const COLORS = [
  '#ff6b9d', '#4d96ff', '#ffd93d', '#6bcb77',
  '#ff9a3c', '#c77dff', '#ff6b9d', '#4d96ff',
  '#ffd93d', '#6bcb77', '#ff9a3c', '#c77dff',
  '#ff6b9d', '#4d96ff', '#ffd93d',
]

const CANVAS_SIZE = 480
const TOTAL_SEGMENTS = 15

export default function WheelPage({ name, initialItems, onBack }) {
  const canvasRef   = useRef(null)
  const angleRef    = useRef(0)
  const itemsRef    = useRef([...initialItems])
  const animRef     = useRef(null)

  const [items,   setItems]   = useState([...initialItems])
  const [spinning, setSpinning] = useState(false)
  const [modal,   setModal]   = useState(null)

  const arc = (2 * Math.PI) / TOTAL_SEGMENTS

  // ─── Drawing ────────────────────────────────────────────────────────────────

  function draw(angle, current = itemsRef.current) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')
    const cx     = CANVAS_SIZE / 2
    const cy     = CANVAS_SIZE / 2
    const radius = cx - 18

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    current.forEach((item, i) => {
      const startA = angle + i * arc - Math.PI / 2
      const endA   = startA + arc

      // Segment fill
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, startA, endA)
      ctx.fillStyle = item.label === '' ? '#ede0f7' : COLORS[i]
      ctx.fill()
      ctx.strokeStyle = '#3a2d4e'
      ctx.lineWidth   = 2
      ctx.stroke()

      if (!item.label) return

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(startA + arc / 2)
      ctx.textAlign = 'left'
      ctx.fillStyle = '#1a1030'

      // Emoji inline before label on the same baseline
      ctx.font = '14px serif'
      ctx.fillText(item.emoji, 58, 5)
      const emojiWidth = ctx.measureText(item.emoji + ' ').width

      ctx.font = 'bold 13px sans-serif'
      const textStart = 58 + emojiWidth
      const maxWidth  = radius - textStart - 4
      const short = ctx.measureText(item.label).width <= maxWidth
        ? item.label
        : item.label.slice(0, Math.floor(item.label.length * (maxWidth / ctx.measureText(item.label).width))) + '…'
      ctx.fillText(short, textStart, 5)

      ctx.restore()
    })

    // Outer border ring
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = '#3a2d4e'
    ctx.lineWidth   = 3.5
    ctx.stroke()

    // Center circle
    ctx.beginPath()
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI)
    ctx.fillStyle   = 'white'
    ctx.fill()
    ctx.strokeStyle = '#3a2d4e'
    ctx.lineWidth   = 2.5
    ctx.stroke()

    // Center dot
    ctx.beginPath()
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI)
    ctx.fillStyle = '#3a2d4e'
    ctx.fill()
  }

  useEffect(() => { draw(angleRef.current) }, [])
  useEffect(() => { draw(angleRef.current) }, [items])

  // ─── Spin logic ─────────────────────────────────────────────────────────────

  function getValidIndices(current) {
    return current.map((item, i) => item.label ? i : -1).filter(i => i !== -1)
  }

  function spinTo(targetIndex, current) {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setSpinning(true)
    setModal(null)

    const startAngle = angleRef.current

    // Calculate the exact rotation needed to land targetIndex under the pointer
    // Pointer is at top (-PI/2). Segment i's center is at: A + i*arc + arc/2 - PI/2
    // We want: startAngle + totalRot + i*arc + arc/2 - PI/2 = -PI/2 + k*2*PI
    // => totalRot = -startAngle - i*arc - arc/2 + k*2*PI
    const base       = -startAngle - targetIndex * arc - arc / 2
    const normalized = ((base % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
    const extraSpins = (Math.floor(Math.random() * 5) + 8) * 2 * Math.PI
    const totalRot   = normalized + extraSpins

    const duration = 3800 + Math.random() * 1000
    const start    = performance.now()

    function animate(now) {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 4)  // ease-out quart

      angleRef.current = startAngle + totalRot * eased
      draw(angleRef.current, current)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        setSpinning(false)
        setModal(current[targetIndex])
      }
    }

    animRef.current = requestAnimationFrame(animate)
  }

  function spin(current = itemsRef.current) {
    if (spinning) return
    const valid = getValidIndices(current)
    if (!valid.length) return
    spinTo(valid[Math.floor(Math.random() * valid.length)], current)
  }

  // ─── Modal actions ───────────────────────────────────────────────────────────

  function handleSmokeAgain() {
    setModal(null)
    setTimeout(() => spin(), 350)
  }

  function handleRemoveAndSpin() {
    const label    = modal.label
    const newItems = itemsRef.current.map(item =>
      item.label === label ? { label: '', emoji: '', isSmoke: false } : item
    )
    itemsRef.current = newItems
    setItems(newItems)
    setModal(null)
    setTimeout(() => spin(newItems), 350)
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="wheel-page">
      <button className="wheel-back" onClick={onBack}>← Back to home</button>

      <h1 className="wheel-title">{name}&apos;s Wheel 🎡</h1>

      <div className="wheel-wrap">
        <div className="wheel-pointer">▼</div>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="wheel-canvas"
        />
      </div>

      <button className="spin-button" onClick={() => spin()} disabled={spinning}>
        {spinning ? 'Spinning…' : 'SPIN! 🎰'}
      </button>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-emoji">{modal.emoji}</div>
            <h2>{modal.label}</h2>
            {modal.isSmoke ? (
              <button className="modal-btn smoke" onClick={handleSmokeAgain}>
                We smoked! Spin Again 🍃
              </button>
            ) : (
              <button className="modal-btn remove" onClick={handleRemoveAndSpin}>
                Remove and spin again 🔄
              </button>
            )}
            <button className="modal-btn keep" onClick={() => setModal(null)}>
              This is the one! ✨
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

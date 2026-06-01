import { useRef } from 'react'
import { motion } from 'framer-motion'
import { usePlayer } from '../context/PlayerContext'
import './CoverFlow.css'

const VISIBLE = [-2, -1, 0, 1, 2]

function CoverCard({ song, offset, onSelect, isActive }) {
  const absOffset = Math.abs(offset)
  const isCenter = offset === 0

  return (
    <motion.button
      type="button"
      className={`coverflow__card ${isCenter ? 'coverflow__card--active' : ''}`}
      onClick={() => onSelect(song.id)}
      initial={false}
      animate={{
        x: offset * (typeof window !== 'undefined' && window.innerWidth < 640 ? 72 : 120),
        z: isCenter ? 80 : -absOffset * 60,
        rotateY: offset * -28,
        scale: isCenter ? 1 : 0.78 - absOffset * 0.06,
        opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.22,
        filter: isCenter ? 'brightness(1)' : `brightness(${0.55 - absOffset * 0.1})`,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      style={{ zIndex: 10 - absOffset }}
      whileHover={isCenter ? { scale: 1.02 } : { scale: 0.82 }}
      aria-label={`${song.title} by ${song.artist}`}
    >
      {isCenter && <div className="coverflow__glow" style={{ background: song.accent }} />}
      <div className="coverflow__image-wrap">
        <img src={song.cover} alt="" className="coverflow__image" loading="lazy" />
      </div>
      <div className="coverflow__info glass">
        <h3 className="coverflow__title">{song.title}</h3>
        <p className="coverflow__artist">{song.artist}</p>
      </div>
      {isActive && isCenter && (
        <motion.div
          className="coverflow__playing"
          layoutId="playing-ring"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        />
      )}
    </motion.button>
  )
}

export default function CoverFlow() {
  const { songs, currentIndex, setCurrentIndex, playSong, isPlaying } = usePlayer()
  const containerRef = useRef(null)

  const handleSelect = (id) => {
    const idx = songs.findIndex((s) => s.id === id)
    if (idx >= 0) {
      if (idx === currentIndex) return
      setCurrentIndex(idx)
      playSong(id)
    }
  }

  const go = (dir) => {
    const next = (currentIndex + dir + songs.length) % songs.length
    setCurrentIndex(next)
    playSong(songs[next].id)
  }

  return (
    <section className="coverflow" ref={containerRef}>
      <div className="coverflow__stage">
        <div className="coverflow__track">
          {VISIBLE.map((offset) => {
            const idx = (currentIndex + offset + songs.length) % songs.length
            const song = songs[idx]
            return (
              <CoverCard
                key={`${song.id}-${offset}`}
                song={song}
                offset={offset}
                onSelect={handleSelect}
                isActive={isPlaying && offset === 0}
              />
            )
          })}
        </div>
      </div>
      <div className="coverflow__nav-dots">
        {songs.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`coverflow__dot ${i === currentIndex ? 'coverflow__dot--active' : ''}`}
            onClick={() => {
              setCurrentIndex(i)
              playSong(s.id)
            }}
            aria-label={`Go to ${s.title}`}
          />
        ))}
      </div>
      <div className="coverflow__arrows">
        <button type="button" className="coverflow__arrow glass" onClick={() => go(-1)} aria-label="Previous">
          ‹
        </button>
        <button type="button" className="coverflow__arrow glass" onClick={() => go(1)} aria-label="Next">
          ›
        </button>
      </div>
    </section>
  )
}

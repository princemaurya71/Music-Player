import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import './ScreenOffOverlay.css'

export default function ScreenOffOverlay() {
  const {
    screenOff,
    setScreenOff,
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    progress,
  } = usePlayer()

  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    if (!screenOff) return
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [screenOff])

  const formatted = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <AnimatePresence>
      {screenOff && (
        <motion.div
          className="screen-off"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setScreenOff(false)}
          role="presentation"
        >
          <div className="screen-off__ambient" style={{ background: currentSong.accent }} />
          <button
            type="button"
            className="screen-off__close"
            onClick={(e) => {
              e.stopPropagation()
              setScreenOff(false)
            }}
            aria-label="Exit screen off"
          >
            <X size={20} />
          </button>
          <div className="screen-off__clock">{formatted}</div>
          <div className="screen-off__info" onClick={(e) => e.stopPropagation()}>
            <img src={currentSong.cover} alt="" />
            <h2>{currentSong.title}</h2>
            <p>{currentSong.artist}</p>
            <div className="screen-off__progress">
              <div style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
          <div className="screen-off__controls" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={playPrev} aria-label="Previous">
              <SkipBack size={28} />
            </button>
            <button type="button" className="screen-off__play" onClick={togglePlay} aria-label="Play pause">
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
            </button>
            <button type="button" onClick={playNext} aria-label="Next">
              <SkipForward size={28} />
            </button>
          </div>
          <p className="screen-off__hint">Tap outside controls or ✕ to wake · Music keeps playing</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  MessageSquareQuote,
  ListMusic,
  Volume2,
  VolumeX,
  Heart,
} from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import './PlayerBar.css'

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    progress,
    seek,
    volume,
    setVolume,
    showLyrics,
    setShowLyrics,
    showQueue,
    setShowQueue,
    orderedSongs,
    playSong,
    isFavorite,
    toggleFavorite,
    audioRef,
  } = usePlayer()

  const [muted, setMuted] = useState(false)
  const duration = audioRef.current?.duration ?? currentSong.duration ?? 0
  const currentTime = progress * duration

  const handleVolume = (v) => {
    setMuted(false)
    setVolume(v)
  }

  return (
    <>
      <footer className="player glass">
        <div className="player__controls">
          <button type="button" onClick={playPrev} aria-label="Previous">
            <SkipBack size={22} fill="currentColor" />
          </button>
          <motion.button
            type="button"
            className="player__play"
            onClick={togglePlay}
            whileTap={{ scale: 0.92 }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </motion.button>
          <button type="button" onClick={playNext} aria-label="Next">
            <SkipForward size={22} fill="currentColor" />
          </button>
        </div>

        <div className="player__now glass">
          <img src={currentSong.cover} alt="" className="player__thumb" />
          <div className="player__meta">
            <div className="player__meta-top">
              <span className="player__title">{currentSong.title}</span>
              <button
                type="button"
                className={`player__fav ${isFavorite(currentSong.id) ? 'player__fav--on' : ''}`}
                onClick={() => toggleFavorite(currentSong.id)}
                aria-label="Favorite"
              >
                <Heart size={14} fill={isFavorite(currentSong.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            <span className="player__artist">{currentSong.artist}</span>
            <div
              className="player__progress"
              role="slider"
              aria-valuenow={Math.round(progress * 100)}
              tabIndex={0}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                seek((e.clientX - rect.left) / rect.width)
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') seek(Math.min(1, progress + 0.05))
                if (e.key === 'ArrowLeft') seek(Math.max(0, progress - 0.05))
              }}
            >
              <motion.div
                className="player__progress-fill"
                style={{ width: `${progress * 100}%` }}
                layout
              />
            </div>
            <div className="player__time">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="player__extras">
          <button
            type="button"
            className={showLyrics ? 'player__icon--active' : ''}
            onClick={() => setShowLyrics((s) => !s)}
            aria-label="Lyrics"
          >
            <MessageSquareQuote size={20} />
          </button>
          <button
            type="button"
            className={showQueue ? 'player__icon--active' : ''}
            onClick={() => setShowQueue((s) => !s)}
            aria-label="Queue"
          >
            <ListMusic size={20} />
          </button>
          <div className="player__volume">
            <button
              type="button"
              onClick={() => {
                setMuted((m) => !m)
                if (!muted) setVolume(0)
                else setVolume(0.8)
              }}
              aria-label="Mute"
            >
              {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={(e) => handleVolume(Number(e.target.value))}
              className="player__volume-slider"
              aria-label="Volume"
            />
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showLyrics && (
          <motion.aside
            className="player-panel glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h3>Lyrics</h3>
            <p className="player-panel__lyrics">
              ♪ {currentSong.title} — {currentSong.artist} ♪
              <br /><br />
              Demo lyrics panel. Connect a lyrics API for live text.
              <br /><br />
              I&apos;ve been on my own for long enough…
              <br />
              Maybe you can show me how to love, maybe…
            </p>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQueue && (
          <motion.aside
            className="player-panel player-panel--queue glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <h3>Up Next</h3>
            <ul className="player-panel__queue">
              {orderedSongs.map((song) => (
                <li key={song.id}>
                  <button type="button" onClick={() => playSong(song.id)}>
                    <img src={song.cover} alt="" />
                    <div>
                      <strong>{song.title}</strong>
                      <span>{song.artist}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

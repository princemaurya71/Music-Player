import { motion } from 'framer-motion'
import { Play, Heart, TrendingUp } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import './SongGrid.css'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function SongGrid({ songs, title, subtitle, emptyMessage }) {
  const { playSong, currentSong, isPlaying, togglePlay, isFavorite, toggleFavorite } = usePlayer()

  if (!songs.length) {
    return (
      <div className="song-grid-empty glass">
        <p>{emptyMessage || 'No songs found.'}</p>
      </div>
    )
  }

  return (
    <section className="song-grid-section page-enter">
      {(title || subtitle) && (
        <header className="song-grid-header">
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
        </header>
      )}
      <motion.div className="song-grid" variants={container} initial="hidden" animate="show">
        {songs.map((song) => {
          const active = currentSong.id === song.id
          return (
            <motion.article
              key={song.id}
              className={`song-card glass ${active ? 'song-card--active' : ''}`}
              variants={item}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="song-card__glow" style={{ background: song.accent }} />
              <div className="song-card__cover">
                <img src={song.cover} alt="" loading="lazy" />
                {song.trending && (
                  <span className="song-card__badge">
                    <TrendingUp size={12} /> Hot
                  </span>
                )}
                <button
                  type="button"
                  className="song-card__play"
                  onClick={() => {
                    if (active && isPlaying) togglePlay()
                    else playSong(song.id)
                  }}
                  aria-label={`Play ${song.title}`}
                >
                  {active && isPlaying ? '❚❚' : <Play size={22} fill="currentColor" />}
                </button>
              </div>
              <div className="song-card__body">
                <div>
                  <h3>{song.title}</h3>
                  <p>{song.artist}</p>
                </div>
                <button
                  type="button"
                  className={`song-card__fav ${isFavorite(song.id) ? 'song-card__fav--on' : ''}`}
                  onClick={() => toggleFavorite(song.id)}
                  aria-label="Favorite"
                >
                  <Heart size={18} fill={isFavorite(song.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </motion.article>
          )
        })}
      </motion.div>
    </section>
  )
}

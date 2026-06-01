import { motion } from 'framer-motion'
import { usePlayer } from '../context/PlayerContext'
import { playlists } from '../data/songs'
import './Playlist.css'

export default function Playlist() {
  const { songs, playSong } = usePlayer()

  return (
    <motion.section
      className="playlist-page page-enter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="playlist-page__header">
        <h1>Playlists</h1>
        <p>Curated collections for every mood</p>
      </header>

      <div className="playlist-page__grid">
        {playlists.map((pl, i) => {
          const plSongs = songs.filter((s) => s.playlistIds?.includes(pl.id))
          return (
            <motion.article
              key={pl.id}
              className="playlist-card glass"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="playlist-card__banner" style={{ background: pl.color }}>
                <div className="playlist-card__covers">
                  {plSongs.slice(0, 4).map((s) => (
                    <img key={s.id} src={s.cover} alt="" />
                  ))}
                </div>
              </div>
              <div className="playlist-card__body">
                <h2>{pl.name}</h2>
                <p>{plSongs.length} songs</p>
                <ul className="playlist-card__tracks">
                  {plSongs.map((song) => (
                    <li key={song.id}>
                      <button type="button" onClick={() => playSong(song.id)}>
                        <img src={song.cover} alt="" />
                        <span>
                          <strong>{song.title}</strong>
                          <em>{song.artist}</em>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          )
        })}
      </div>
    </motion.section>
  )
}

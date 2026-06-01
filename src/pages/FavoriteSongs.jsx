import { motion } from 'framer-motion'
import SongGrid from '../components/SongGrid'
import { usePlayer } from '../context/PlayerContext'

export default function FavoriteSongs() {
  const { songs, favorites } = usePlayer()
  const favSongs = songs.filter((s) => favorites.includes(s.id))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SongGrid
        songs={favSongs}
        title="Favorite Songs"
        subtitle="Your personal collection"
        emptyMessage="No favorites yet — tap ♥ on any track to save it here."
      />
    </motion.div>
  )
}

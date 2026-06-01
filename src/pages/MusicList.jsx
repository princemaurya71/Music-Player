import { motion } from 'framer-motion'
import SongGrid from '../components/SongGrid'
import { usePlayer } from '../context/PlayerContext'

export default function MusicList() {
  const { songs } = usePlayer()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SongGrid
        songs={songs}
        title="Music List"
        subtitle={`${songs.length} tracks in your library`}
      />
    </motion.div>
  )
}

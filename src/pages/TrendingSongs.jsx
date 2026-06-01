import { motion } from 'framer-motion'
import SongGrid from '../components/SongGrid'
import { usePlayer } from '../context/PlayerContext'

export default function TrendingSongs() {
  const { songs } = usePlayer()
  const trending = songs.filter((s) => s.trending)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SongGrid
        songs={trending}
        title="Trending Songs"
        subtitle="What's hot right now"
      />
    </motion.div>
  )
}

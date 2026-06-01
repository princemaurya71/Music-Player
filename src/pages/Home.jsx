import { motion } from 'framer-motion'
import CoverFlow from '../components/CoverFlow'
import { usePlayer } from '../context/PlayerContext'
import './Home.css'

export default function Home() {
  const { currentSong } = usePlayer()

  return (
    <motion.div
      className="home page-enter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="home__hero">
        <motion.span
          className="home__tag glass"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Now Playing
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Feel the <span>Rhythm</span>
        </motion.h1>
        <motion.p
          className="home__sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          Swipe through albums · Tap a card to play
        </motion.p>
      </header>
      <CoverFlow />
    </motion.div>
  )
}

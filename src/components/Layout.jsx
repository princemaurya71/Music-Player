import { usePlayer } from '../context/PlayerContext'
import Navbar from './Navbar'
import PlayerBar from './PlayerBar'
import AmbientBackground from './AmbientBackground'
import './Layout.css'

export default function Layout({ children }) {
  const { currentSong } = usePlayer()

  return (
    <div className="layout">
      <AmbientBackground accent={currentSong.accent} />
      <Navbar />
      <main className="layout__main">{children}</main>
      <PlayerBar />
    </div>
  )
}

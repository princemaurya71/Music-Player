import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import MusicList from './pages/MusicList'
import TrendingSongs from './pages/TrendingSongs'
import FavoriteSongs from './pages/FavoriteSongs'
import Playlist from './pages/Playlist'
import ScreenOffOverlay from './components/ScreenOffOverlay'

export default function App() {
  const location = useLocation()

  return (
    <>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/music-list" element={<MusicList />} />
            <Route path="/trending" element={<TrendingSongs />} />
            <Route path="/favorites" element={<FavoriteSongs />} />
            <Route path="/playlist" element={<Playlist />} />
          </Routes>
        </AnimatePresence>
      </Layout>
      <ScreenOffOverlay />
    </>
  )
}

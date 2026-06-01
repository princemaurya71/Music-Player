import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { songs as defaultSongs } from '../data/songs'

const PlayerContext = createContext(null)

const FAVORITES_KEY = 'aura-favorites'
const THEME_KEY = 'aura-theme'

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark'
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [favorites, setFavorites] = useState(loadFavorites)
  const [theme, setTheme] = useState(loadTheme)
  const [screenOff, setScreenOff] = useState(false)
  const [backgroundPlay, setBackgroundPlay] = useState(true)
  const [showLyrics, setShowLyrics] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [queue, setQueue] = useState(defaultSongs.map((s) => s.id))

  const currentSong = defaultSongs[currentIndex] ?? defaultSongs[0]

  const orderedSongs = useMemo(
    () => queue.map((id) => defaultSongs.find((s) => s.id === id)).filter(Boolean),
    [queue],
  )

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    )
  }, [])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  const playSong = useCallback(
    (id) => {
      const idx = defaultSongs.findIndex((s) => s.id === id)
      if (idx >= 0) {
        setCurrentIndex(idx)
        setIsPlaying(true)
      }
    },
    [],
  )

  const playNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % defaultSongs.length)
    setIsPlaying(true)
  }, [])

  const playPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + defaultSongs.length) % defaultSongs.length)
    setIsPlaying(true)
  }, [])

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), [])

  const seek = useCallback((ratio) => {
    const audio = audioRef.current
    if (audio?.duration) {
      audio.currentTime = ratio * audio.duration
      setProgress(ratio)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying, currentIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration)
    }
    const onEnded = () => playNext()

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
    }
  }, [playNext])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.src = currentSong.audio
      audio.load()
      if (isPlaying) audio.play().catch(() => {})
    }
  }, [currentSong.audio])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artist,
      album: currentSong.album,
      artwork: [{ src: currentSong.cover, sizes: '512x512', type: 'image/jpeg' }],
    })

    navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true))
    navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false))
    navigator.mediaSession.setActionHandler('previoustrack', playPrev)
    navigator.mediaSession.setActionHandler('nexttrack', playNext)
  }, [currentSong, playNext, playPrev])

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'
    }
  }, [isPlaying])

  useEffect(() => {
    const onVisibility = () => {
      if (!backgroundPlay) return
      const audio = audioRef.current
      if (!audio || !isPlaying) return
      if (document.hidden) {
        audio.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [backgroundPlay, isPlaying])

  useEffect(() => {
    const wakeLockRef = { lock: null }
    const requestWakeLock = async () => {
      if (!backgroundPlay || !isPlaying || !('wakeLock' in navigator)) return
      try {
        wakeLockRef.lock = await navigator.wakeLock.request('screen')
      } catch {
        /* unsupported */
      }
    }
    requestWakeLock()
    return () => {
      wakeLockRef.lock?.release?.()
    }
  }, [backgroundPlay, isPlaying])

  const value = {
    songs: defaultSongs,
    orderedSongs,
    currentSong,
    currentIndex,
    setCurrentIndex,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    playSong,
    progress,
    seek,
    volume,
    setVolume,
    favorites,
    toggleFavorite,
    isFavorite,
    theme,
    toggleTheme,
    screenOff,
    setScreenOff,
    backgroundPlay,
    setBackgroundPlay,
    showLyrics,
    setShowLyrics,
    showQueue,
    setShowQueue,
    queue,
    setQueue,
    audioRef,
  }

  return (
    <PlayerContext.Provider value={value}>
      <audio ref={audioRef} preload="metadata" />
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}

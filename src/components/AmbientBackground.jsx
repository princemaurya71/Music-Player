import { motion, AnimatePresence } from 'framer-motion'
import './AmbientBackground.css'

export default function AmbientBackground({ accent }) {
  return (
    <div className="ambient" aria-hidden="true">
      <div
        className="ambient__gradient"
        style={{
          background: `linear-gradient(180deg, var(--bg-top) 0%, var(--bg-mid) 45%, var(--bg-bottom) 100%)`,
        }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={accent}
          className="ambient__orb ambient__orb--1"
          style={{ background: accent }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.35, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>
      <div className="ambient__orb ambient__orb--2" />
      <div className="ambient__orb ambient__orb--3" />
      <div className="ambient__noise" />
    </div>
  )
}

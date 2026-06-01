import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, Sun, Moon, MonitorOff, Radio, Menu, X } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import "./Navbar.css";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/music-list", label: "Music List" },
  { to: "/trending", label: "Trending" },
  { to: "/favorites", label: "Favorites" },
  { to: "/playlist", label: "Playlist" },
];

export default function Navbar() {
  const {
    theme,
    toggleTheme,
    setScreenOff,
    backgroundPlay,
    setBackgroundPlay,
  } = usePlayer();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="navbar glass">
      <NavLink to="/" className="navbar__brand">
        <Music2 size={22} className="navbar__logo" />
        <span>Musica</span>
      </NavLink>

      <nav className="navbar__links">
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `navbar__link ${isActive ? "navbar__link--active" : ""}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="navbar__actions">
        <button
          type="button"
          className={`navbar__toggle ${
            backgroundPlay ? "navbar__toggle--on" : ""
          }`}
          onClick={() => setBackgroundPlay((b) => !b)}
          title="Background play"
          aria-label="Toggle background play"
        >
          <Radio size={18} />
        </button>
        <button
          type="button"
          className="navbar__toggle"
          onClick={() => setScreenOff(true)}
          title="Screen off mode"
          aria-label="Screen off"
        >
          <MonitorOff size={18} />
        </button>
        <button
          type="button"
          className="navbar__toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          type="button"
          className="navbar__menu-btn"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar__mobile glass"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {links.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `navbar__mobile-link ${
                    isActive ? "navbar__link--active" : ""
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <div className="navbar__mobile-features">
              <label className="navbar__feature">
                <input
                  type="checkbox"
                  checked={backgroundPlay}
                  onChange={() => setBackgroundPlay((b) => !b)}
                />
                Background playing
              </label>
              <button
                type="button"
                className="navbar__feature-btn"
                onClick={() => {
                  setScreenOff(true);
                  setMobileOpen(false);
                }}
              >
                Screen off mode
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

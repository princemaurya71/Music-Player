# Aura — Glassmorphism Music Player

A modern React music player inspired by cover-flow UI design, with glassmorphism, 3D carousel, and full responsive layout.

## Features

- **3D Cover Flow** — Interactive album carousel on the home page
- **Pages** — Music List, Trending, Favorites, Playlists (consistent glass UI)
- **Dark / Light mode** — Toggle in navbar (saved to localStorage)
- **Screen off mode** — Black ambient screen with clock & controls; music continues
- **Background play** — Keeps audio playing when tab is hidden; Media Session API for OS controls
- **Player bar** — Play/pause, skip, progress, volume, lyrics panel, queue
- **Animations** — Framer Motion transitions throughout

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Tech stack

- React 19 + Vite
- React Router
- Framer Motion
- Lucide React icons

Demo audio uses [SoundHelix](https://www.soundhelix.com/) sample MP3s. Replace URLs in `src/data/songs.js` with your own tracks.

# 🌷 Davi Space

A personal, emotional productivity space — built from scratch as a love letter in code.

**Live:** [davi-space.vercel.app](https://davi-space.vercel.app)

---

## ✨ Features

- 🔐 **Authentication** — Email/password + Google OAuth, protected routes, password reset
- 📖 **Mood Journal** — CRUD entries with mood tagging, search, filters, sort
- 💌 **Future Letters** — Write letters to your future self with countdown unlock timers
- 📸 **Memory Wall** — Photo uploads with captions, tags, favorites, lightbox view
- 🎬 **Media Vault** — Save & embed YouTube, Spotify, Instagram links with auto-detection
- 🎨 **5 Custom Themes** — Including a hidden Spider-Man theme, with per-theme particles & cursors
- 🔥 **Streak System** — Daily journaling streak tracker
- 🎁 **Davi Wrapped** — Spotify-Wrapped style yearly recap
- 👤 **Profile** — Avatar upload, emoji picker, stats dashboard
- 📱 **PWA** — Installable on mobile, works offline
- 🥚 **Easter Eggs** — Hidden interactions and secret pages
- ✨ **Animations** — Page transitions, floating particles, micro-interactions throughout

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** CSS Modules + CSS Variables (theming)
- **State:** Zustand
- **Animations:** Framer Motion
- **Backend:** Supabase (Auth, Postgres, Storage, RLS)
- **Deployment:** Vercel

---

## 🏗️ Architecture

```
src/
├── modules/          # Feature-based modules (journal, letters, memory, media, etc.)
│   └── [feature]/
│       ├── index.jsx
│       ├── [feature].store.js
│       ├── [feature].api.js
│       └── *.module.css
├── components/       # Shared components (Layout, ProtectedRoute, Particles)
├── hooks/            # Custom hooks (useTheme, useCountdown, useKonami)
├── lib/              # Utilities (supabase client, quotes, streak logic)
├── pages/            # Top-level pages (Dashboard)
└── styles/           # Global styles & theme definitions
```

Each feature module is self-contained: its own state, API calls, and components — making the codebase easy to navigate and extend.

---

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data (`auth.uid() = user_id`)
- Storage policies restrict uploads/deletes to authenticated users

---

## 📱 Run Locally

```bash
npm install
npm run dev
```

Create a `.env` file in the root with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 💌 Why This Exists

Some apps are built to solve problems. This one was built for a person —
a small, private space designed around comfort, reflection, and care.

Every detail, from the tulip cursor to the random comfort messages,
was a deliberate choice to make the app feel less like software
and more like a little world.
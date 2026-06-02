import { useEffect, useState } from 'react'
import { useAuthStore } from '../auth/auth.store'
import { useMediaStore } from './media.store'
import MediaCard from './MediaCard'
import MediaForm from './MediaForm'
import styles from './media.module.css'

const PLATFORMS = [
  { key: 'all',       label: 'all',        emoji: '✨' },
  { key: 'youtube',   label: 'YouTube',    emoji: '🎬' },
  { key: 'spotify',   label: 'Spotify',    emoji: '🎵' },
  { key: 'instagram', label: 'Instagram',  emoji: '📸' },
  { key: 'soundcloud',label: 'SoundCloud', emoji: '🎧' },
  { key: 'link',      label: 'Links',      emoji: '🔗' },
]

export default function MediaPage() {
  const user = useAuthStore(s => s.user)
  const {
    loading, loadMedia,
    searchQuery, setSearch,
    filterPlatform, setFilterPlatform,
    showFavOnly, toggleFavOnly,
    getFiltered
  } = useMediaStore()

  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (user) loadMedia(user.id)
  }, [user])

  const items = getFiltered()

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>media vault 🎬</h1>
          <p className={styles.sub}>reels, songs & things you love 🌷</p>
        </div>
        <button className={styles.newBtn} onClick={() => setShowForm(true)}>
          + save something
        </button>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="search your vault..."
          value={searchQuery}
          onChange={e => setSearch(e.target.value)}
          className={styles.search}
        />
        <button
          onClick={toggleFavOnly}
          className={`${styles.favFilter} ${showFavOnly ? styles.favFilterActive : ''}`}
        >
          {showFavOnly ? '🌷 favorites' : '🤍 favorites'}
        </button>
      </div>

      {/* Platform filters */}
      <div className={styles.platformFilters}>
        {PLATFORMS.map(p => (
          <button
            key={p.key}
            onClick={() => setFilterPlatform(p.key)}
            className={`${styles.platformBtn} ${filterPlatform === p.key ? styles.platformBtnActive : ''}`}
          >
            {p.emoji} {p.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.empty}>loading your vault 🎬</div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyEmoji}>🎬</p>
          <p className={styles.emptyText}>
            {searchQuery || filterPlatform !== 'all' || showFavOnly
              ? 'nothing matches'
              : 'vault is empty — save something you love 🌷'}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map(item => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {showForm && <MediaForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
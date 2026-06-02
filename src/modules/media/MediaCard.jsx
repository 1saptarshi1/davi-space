import { useState } from 'react'
import { useMediaStore } from './media.store'
import {
  getPlatformInfo,
  getYouTubeEmbed,
  getSpotifyEmbed,
  getYouTubeThumbnail
} from './media.utils'
import styles from './MediaCard.module.css'

export default function MediaCard({ item }) {
  const { toggleFavorite, deleteItem } = useMediaStore()
  const [showEmbed, setShowEmbed] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const platformInfo = getPlatformInfo(item.platform)
  const youtubeEmbed = item.platform === 'youtube' ? getYouTubeEmbed(item.url) : null
  const spotifyEmbed = item.platform === 'spotify' ? getSpotifyEmbed(item.url) : null
  const ytThumb = item.platform === 'youtube' ? getYouTubeThumbnail(item.url) : null

  const tags = item.tags
    ? item.tags.split(',').map(t => t.trim()).filter(Boolean)
    : []

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    await deleteItem(item.id)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <div className={styles.card}>

      {/* Platform header */}
      <div className={styles.header}>
        <div
          className={styles.platformBadge}
          style={{ background: platformInfo.color + '22', color: platformInfo.color }}
        >
          <span>{platformInfo.emoji}</span>
          <span>{platformInfo.label}</span>
        </div>
        <button
          className={`${styles.favBtn} ${item.favorite ? styles.favActive : ''}`}
          onClick={() => toggleFavorite(item.id, item.favorite)}
        >
          {item.favorite ? '🌷' : '🤍'}
        </button>
      </div>

      {/* Title */}
      <h3 className={styles.title}>{item.title}</h3>

      {/* Embed area */}
      {!showEmbed ? (
        <div className={styles.previewWrap} onClick={() => setShowEmbed(true)}>
          {ytThumb ? (
            <img src={ytThumb} alt={item.title} className={styles.ytThumb} />
          ) : (
            <div
              className={styles.previewPlaceholder}
              style={{ background: platformInfo.color + '15' }}
            >
              <span className={styles.previewIcon}>{platformInfo.emoji}</span>
              <span className={styles.previewText}>click to load</span>
            </div>
          )}
          <div className={styles.playOverlay}>
            <span className={styles.playBtn}>▶</span>
          </div>
        </div>
      ) : (
        <div className={styles.embedWrap}>
          {youtubeEmbed && (
            <iframe
              src={youtubeEmbed}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.iframe}
            />
          )}
          {spotifyEmbed && (
            <iframe
              src={spotifyEmbed}
              title={item.title}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className={styles.spotifyFrame}
            />
          )}
          {!youtubeEmbed && !spotifyEmbed && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openLink}
            >
              open {platformInfo.label} →
            </a>
          )}
          <button className={styles.hideBtn} onClick={() => setShowEmbed(false)}>
            hide
          </button>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map(tag => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.date}>{formatDate(item.created_at)}</span>
        <button
          onClick={handleDelete}
          className={`${styles.deleteBtn} ${confirmDelete ? styles.confirm : ''}`}
        >
          {confirmDelete ? 'sure?' : 'delete'}
        </button>
      </div>

    </div>
  )
}
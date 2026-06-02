import { useState } from 'react'
import { useMemoryStore } from './memory.store'
import styles from './MemoryCard.module.css'

export default function MemoryCard({ memory }) {
  const { toggleFavorite, deleteMemory } = useMemoryStore()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [lightbox, setLightbox] = useState(false)

  const tags = memory.tags
    ? memory.tags.split(',').map(t => t.trim()).filter(Boolean)
    : []

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    await deleteMemory(memory.id, memory.image_url)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <>
      <div className={styles.card}>
        <div className={styles.imgWrap}>
          {!imgLoaded && <div className={styles.imgSkeleton} />}
          <img
            src={memory.image_url}
            alt={memory.caption || 'memory'}
            className={`${styles.img} ${imgLoaded ? styles.imgVisible : ''}`}
            onLoad={() => setImgLoaded(true)}
            onClick={() => setLightbox(true)}
          />
          <button
            className={`${styles.favBtn} ${memory.favorite ? styles.favActive : ''}`}
            onClick={() => toggleFavorite(memory.id, memory.favorite)}
          >
            {memory.favorite ? '🌷' : '🤍'}
          </button>
        </div>

        <div className={styles.info}>
          {memory.caption && (
            <p className={styles.caption}>{memory.caption}</p>
          )}
          {tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map(tag => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}
          <div className={styles.footer}>
            <span className={styles.date}>{formatDate(memory.created_at)}</span>
            <button
              onClick={handleDelete}
              className={`${styles.deleteBtn} ${confirmDelete ? styles.confirm : ''}`}
            >
              {confirmDelete ? 'sure?' : 'delete'}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(false)}>
          <button className={styles.lightboxClose} onClick={() => setLightbox(false)}>✕</button>
          <img
            src={memory.image_url}
            alt={memory.caption || 'memory'}
            className={styles.lightboxImg}
            onClick={e => e.stopPropagation()}
          />
          {memory.caption && (
            <p className={styles.lightboxCaption}>{memory.caption}</p>
          )}
        </div>
      )}
    </>
  )
}
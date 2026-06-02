import { useState, useRef } from 'react'
import { useAuthStore } from '../auth/auth.store'
import { useMemoryStore } from './memory.store'
import styles from './MemoryForm.module.css'

export default function MemoryForm({ onClose }) {
  const user = useAuthStore(s => s.user)
  const { addMemory, uploading } = useMemoryStore()

  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [tags, setTags]       = useState('')
  const [error, setError]     = useState('')
  const fileRef = useRef()

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) {
      setError('image must be under 5MB 🌷')
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setError('pick a photo first 📸'); return }

    setError('')
    const { error } = await addMemory(file, { caption, tags }, user.id)
    if (error) setError(error.message)
    else onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.title}>add a memory 📸</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Drop zone */}
          <div
            className={`${styles.dropZone} ${preview ? styles.hasPreview : ''}`}
            onClick={() => fileRef.current.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            {preview ? (
              <img src={preview} alt="preview" className={styles.preview} />
            ) : (
              <div className={styles.dropContent}>
                <span className={styles.dropIcon}>📸</span>
                <p className={styles.dropText}>drag & drop or click to upload</p>
                <p className={styles.dropSub}>max 5MB</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              style={{ display: 'none' }}
            />
          </div>

          {preview && (
            <button
              type="button"
              className={styles.changeBtn}
              onClick={() => fileRef.current.click()}
            >
              change photo
            </button>
          )}

          <div className={styles.section}>
            <label className={styles.label}>caption</label>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="a moment worth remembering..."
              className={styles.input}
              maxLength={120}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label}>tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="friends, birthday, 2026"
              className={styles.input}
            />
            <p className={styles.hint}>e.g. "friends, summer, happy" — used for filtering</p>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={uploading}>
              {uploading ? 'uploading... 📸' : 'save memory 🌷'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
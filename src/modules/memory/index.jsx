import { useEffect, useState } from 'react'
import { useAuthStore } from '../auth/auth.store'
import { useMemoryStore } from './memory.store'
import MemoryCard from './MemoryCard'
import MemoryForm from './MemoryForm'
import styles from './memory.module.css'

export default function MemoryPage() {
  const user = useAuthStore(s => s.user)
  const {
    loading, loadMemories,
    searchQuery, setSearch,
    filterTag, setFilterTag,
    showFavOnly, toggleFavOnly,
    getFiltered, getAllTags
  } = useMemoryStore()

  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (user) loadMemories(user.id)
  }, [user])

  const memories = getFiltered()
  const allTags  = getAllTags()

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>memory wall 📸</h1>
          <p className={styles.sub}>photos & moments that matter 🌷</p>
        </div>
        <button className={styles.newBtn} onClick={() => setShowForm(true)}>
          + add memory
        </button>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="search memories..."
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

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className={styles.tagFilters}>
          <button
            onClick={() => setFilterTag('all')}
            className={`${styles.tagBtn} ${filterTag === 'all' ? styles.tagBtnActive : ''}`}
          >
            all
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`${styles.tagBtn} ${filterTag === tag ? styles.tagBtnActive : ''}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className={styles.empty}>loading your memories 📸</div>
      ) : memories.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyEmoji}>📸</p>
          <p className={styles.emptyText}>
            {searchQuery || filterTag !== 'all' || showFavOnly
              ? 'no memories match'
              : 'no memories yet — add your first one 🌷'}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {memories.map(m => (
            <MemoryCard key={m.id} memory={m} />
          ))}
        </div>
      )}

      {showForm && <MemoryForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
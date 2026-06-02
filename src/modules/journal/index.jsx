import { useEffect, useState } from 'react'
import { useAuthStore } from '../auth/auth.store'
import { useJournalStore } from './journal.store'
import { MOODS } from './MoodPicker'
import JournalCard from './JournalCard'
import JournalForm from './JournalForm'
import styles from './journal.module.css'

export default function JournalPage() {
  const user = useAuthStore(s => s.user)
  const {
    loading, loadEntries,
    searchQuery, setSearch,
    sortBy, setSort,
    filterMood, setFilterMood,
    getFiltered
  } = useJournalStore()

  const [showForm, setShowForm] = useState(false)
  const [editEntry, setEditEntry] = useState(null)

  useEffect(() => {
    if (user) loadEntries(user.id)
  }, [user])

  const entries = getFiltered()

  const handleEdit = (entry) => {
    setEditEntry(entry)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditEntry(null)
  }

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>mood journal 📖</h1>
          <p className={styles.sub}>every feeling deserves a page 🌷</p>
        </div>
        <button className={styles.newBtn} onClick={() => setShowForm(true)}>
          + new entry
        </button>
      </div>

      {/* Search + filters */}
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="search entries..."
          value={searchQuery}
          onChange={e => setSearch(e.target.value)}
          className={styles.search}
        />

        <select
          value={sortBy}
          onChange={e => setSort(e.target.value)}
          className={styles.select}
        >
          <option value="newest">newest first</option>
          <option value="oldest">oldest first</option>
          <option value="a-z">a → z</option>
        </select>

        <select
          value={filterMood}
          onChange={e => setFilterMood(e.target.value)}
          className={styles.select}
        >
          <option value="all">all moods</option>
          {MOODS.map(m => (
            <option key={m.key} value={m.key}>{m.emoji} {m.label}</option>
          ))}
        </select>
      </div>

      {/* Entries */}
      {loading ? (
        <div className={styles.empty}>loading your entries 🌷</div>
      ) : entries.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyEmoji}>📖</p>
          <p className={styles.emptyText}>
            {searchQuery || filterMood !== 'all'
              ? 'no entries match your search'
              : 'no entries yet — write your first one 🌷'}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {entries.map(entry => (
            <JournalCard key={entry.id} entry={entry} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <JournalForm onClose={handleClose} editEntry={editEntry} />
      )}

    </div>
  )
}
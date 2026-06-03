import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../auth/auth.store'
import { fetchWrappedData } from './wrapped.api'
import { getMostCommon, getMoodInfo, getPlatformEmoji, getWrappedMessage } from './wrapped.utils'
import styles from './wrapped.module.css'

const SLIDES = [
  'intro',
  'journals',
  'moods',
  'memories',
  'letters',
  'media',
  'finale'
]

export default function WrappedPage() {
  const user = useAuthStore(s => s.user)
  const username = user?.user_metadata?.username || 'davi'

  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [slide, setSlide]   = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (user) {
      fetchWrappedData(user.id).then(d => {
        setData(d)
        setLoading(false)
      })
    }
  }, [user])

  if (loading) return (
    <div className={styles.loading}>
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        style={{ fontSize: '3rem' }}
      >
        🎁
      </motion.div>
      <p>preparing your wrapped...</p>
    </div>
  )

  // Compute stats
  const moods = data.journals.map(j => j.mood).filter(Boolean)
  const [topMood, topMoodCount] = getMostCommon(moods) || ['loved', 1]
  const moodInfo = getMoodInfo(topMood)

  const platforms = data.media.map(m => m.platform).filter(Boolean)
  const [topPlatform, topPlatformCount] = getMostCommon(platforms) || ['spotify', 1]

  const stats = {
    totalJournals:  data.journals.length,
    totalMemories:  data.memories.length,
    totalLetters:   data.letters.length,
    totalMedia:     data.media.length,
    favMemories:    data.memories.filter(m => m.favorite).length,
    favMedia:       data.media.filter(m => m.favorite).length,
    topMood,
    topMoodCount,
    moodInfo,
    topPlatform,
    topPlatformCount,
  }

  const wrappedMessage = getWrappedMessage(stats)

  const nextSlide = () => {
    if (slide < SLIDES.length - 1) setSlide(s => s + 1)
  }

  const prevSlide = () => {
    if (slide > 0) setSlide(s => s - 1)
  }

  if (!started) {
    return (
      <div className={styles.startPage}>
        <motion.div
          className={styles.startCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontSize: '4rem' }}
          >
            🎁
          </motion.div>
          <h1 className={styles.startTitle}>Davi Wrapped</h1>
          <p className={styles.startSub}>your year in Davi Space 🌷</p>
          <p className={styles.startDesc}>
            {stats.totalJournals} journal entries · {stats.totalMemories} memories · {stats.totalLetters} letters
          </p>
          <motion.button
            className={styles.startBtn}
            onClick={() => setStarted(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            see my wrapped ✨
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        {SLIDES.map((s, i) => (
          <div
            key={s}
            className={`${styles.progressDot} ${i <= slide ? styles.progressDotActive : ''}`}
            onClick={() => setSlide(i)}
          />
        ))}
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          className={styles.slide}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.35 }}
        >
          {/* INTRO */}
          {SLIDES[slide] === 'intro' && (
            <SlideCard color="var(--color-primary)">
              <BigEmoji>🌷</BigEmoji>
              <SlideTitle>hey {username} 🌷</SlideTitle>
              <SlideText>it's been a whole year in your space.</SlideText>
              <SlideText>let's look back at everything you felt, saved, and wrote.</SlideText>
              <StatBig>{stats.totalJournals + stats.totalMemories + stats.totalLetters + stats.totalMedia}</StatBig>
              <SlideText>things you created this year ✨</SlideText>
            </SlideCard>
          )}

          {/* JOURNALS */}
          {SLIDES[slide] === 'journals' && (
            <SlideCard color="#e8729a">
              <BigEmoji>📖</BigEmoji>
              <SlideTitle>you journaled</SlideTitle>
              <StatBig color="#e8729a">{stats.totalJournals}</StatBig>
              <SlideText>times this year 🌷</SlideText>
              <SlideText style={{ marginTop: '12px', opacity: 0.7, fontSize: '0.9rem' }}>
                {stats.totalJournals === 0
                  ? "start writing — every feeling deserves a page"
                  : stats.totalJournals > 10
                  ? "that's dedication. every entry mattered 💪"
                  : "every entry you wrote was brave 🌷"}
              </SlideText>
            </SlideCard>
          )}

          {/* MOODS */}
          {SLIDES[slide] === 'moods' && (
            <SlideCard color={stats.moodInfo.color}>
              <BigEmoji>{stats.moodInfo.emoji}</BigEmoji>
              <SlideTitle>your top mood was</SlideTitle>
              <StatBig color={stats.moodInfo.color}>{stats.moodInfo.label}</StatBig>
              <SlideText>you felt this {stats.topMoodCount}x 🌷</SlideText>
              {moods.length === 0 && (
                <SlideText style={{ opacity: 0.7 }}>write some journal entries first!</SlideText>
              )}
            </SlideCard>
          )}

          {/* MEMORIES */}
          {SLIDES[slide] === 'memories' && (
            <SlideCard color="#f59e0b">
              <BigEmoji>📸</BigEmoji>
              <SlideTitle>you saved</SlideTitle>
              <StatBig color="#f59e0b">{stats.totalMemories}</StatBig>
              <SlideText>memories this year 🌷</SlideText>
              {stats.favMemories > 0 && (
                <SlideText style={{ marginTop: '12px', opacity: 0.8 }}>
                  and favorited {stats.favMemories} of them 🌷
                </SlideText>
              )}
            </SlideCard>
          )}

          {/* LETTERS */}
          {SLIDES[slide] === 'letters' && (
            <SlideCard color="#a78bfa">
              <BigEmoji>💌</BigEmoji>
              <SlideTitle>you wrote</SlideTitle>
              <StatBig color="#a78bfa">{stats.totalLetters}</StatBig>
              <SlideText>letters to your future self 💌</SlideText>
              <SlideText style={{ marginTop: '12px', opacity: 0.7, fontSize: '0.9rem' }}>
                {stats.totalLetters === 0
                  ? "write your first letter — future you will love it"
                  : "future you is going to feel so loved 🌷"}
              </SlideText>
            </SlideCard>
          )}

          {/* MEDIA */}
          {SLIDES[slide] === 'media' && (
            <SlideCard color="#7aaeed">
              <BigEmoji>{getPlatformEmoji(stats.topPlatform)}</BigEmoji>
              <SlideTitle>your top platform</SlideTitle>
              <StatBig color="#7aaeed">{stats.topPlatform}</StatBig>
              <SlideText>you saved {stats.totalMedia} things total 🎬</SlideText>
              {stats.favMedia > 0 && (
                <SlideText style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                  {stats.favMedia} favorites 🌷
                </SlideText>
              )}
            </SlideCard>
          )}

          {/* FINALE */}
          {SLIDES[slide] === 'finale' && (
            <SlideCard color="var(--color-primary)">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ fontSize: '4rem' }}
              >
                🌷
              </motion.div>
              <SlideTitle>that's your year 🌷</SlideTitle>
              <SlideText style={{ fontSize: '1rem', maxWidth: '280px', textAlign: 'center', lineHeight: 1.6 }}>
                {wrappedMessage}
              </SlideText>
              <motion.button
                className={styles.restartBtn}
                onClick={() => { setSlide(0) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                watch again 🎁
              </motion.button>
            </SlideCard>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className={styles.nav}>
        <button
          onClick={prevSlide}
          className={styles.navBtn}
          disabled={slide === 0}
        >
          ←
        </button>
        <span className={styles.slideCount}>
          {slide + 1} / {SLIDES.length}
        </span>
        <button
          onClick={nextSlide}
          className={styles.navBtn}
          disabled={slide === SLIDES.length - 1}
        >
          →
        </button>
      </div>

    </div>
  )
}

// ── Helper components ──

function SlideCard({ children, color }) {
  return (
    <div className={styles.slideCard} style={{ '--slide-color': color }}>
      <div className={styles.slideGlow} style={{ background: color }} />
      {children}
    </div>
  )
}

function BigEmoji({ children }) {
  return (
    <motion.div
      className={styles.bigEmoji}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

function SlideTitle({ children }) {
  return (
    <motion.h2
      className={styles.slideTitle}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {children}
    </motion.h2>
  )
}

function SlideText({ children, style }) {
  return (
    <motion.p
      className={styles.slideText}
      style={style}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {children}
    </motion.p>
  )
}

function StatBig({ children, color }) {
  return (
    <motion.div
      className={styles.statBig}
      style={{ color: color || 'var(--color-primary)' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.15, duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}
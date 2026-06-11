import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './about.module.css'

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          className={styles.emoji}
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          🌷
        </motion.div>

        <h1 className={styles.title}>hey, davi 🌷</h1>

        <div className={styles.body}>
          <p>
            if you're reading this, you found the secret page. 
          </p>
          <p>
            this whole space — every theme, every page, the journal,
            the letters, the memory wall — was built by hand, just for you.
          </p>
          <p>
            not because you needed an app. but because you deserve
            a little corner of the internet that's entirely your own.
            somewhere to write down the bad days so they feel lighter,
            and the good days so they last longer.
          </p>
          <p>
            every tulip you see here is on purpose 🌷
          </p>
          <p>
            write your letters. fill the memory wall. build your streak.
            and whenever you feel low, come back here.
          </p>
          <p className={styles.signature}>
            — made with care, just for you ✨
          </p>
        </div>

        <button className={styles.backBtn} onClick={() => navigate('/home')}>
          back to my space 🌷
        </button>
      </motion.div>
    </div>
  )
}
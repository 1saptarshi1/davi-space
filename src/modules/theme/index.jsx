import { useTheme, THEMES } from '../../hooks/useTheme'
import styles from './theme.module.css'

export default function ThemePage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1 className={styles.title}>themes 🎨</h1>
        <p className={styles.sub}>pick your vibe for today 🌷</p>
      </div>

      <div className={styles.grid}>
        {THEMES.map(t => (
          <button
            key={t.key}
            className={`${styles.card} ${theme === t.key ? styles.active : ''}`}
            onClick={() => setTheme(t.key)}
          >
            {/* Color preview */}
            <div
              className={styles.preview}
              style={{ background: t.colors[0] }}
            >
              {/* Mini UI mockup */}
              <div className={styles.mockSidebar} style={{ background: t.colors[1] }}>
                <div className={styles.mockDot} style={{ background: t.colors[2] }} />
                <div className={styles.mockLine} style={{ background: t.colors[2] + '44' }} />
                <div className={styles.mockLine} style={{ background: t.colors[2] + '44' }} />
                <div className={styles.mockLine} style={{ background: t.colors[2] + '44' }} />
              </div>
              <div className={styles.mockMain}>
                <div className={styles.mockCard} style={{ background: t.colors[1] }}>
                  <div className={styles.mockTitle} style={{ background: t.colors[2] }} />
                  <div className={styles.mockText} style={{ background: t.colors[2] + '44' }} />
                  <div className={styles.mockText} style={{ background: t.colors[2] + '44', width: '60%' }} />
                </div>
                <div className={styles.mockCard} style={{ background: t.colors[1] }}>
                  <div className={styles.mockTitle} style={{ background: t.colors[2] }} />
                  <div className={styles.mockText} style={{ background: t.colors[2] + '44' }} />
                </div>
              </div>

              {/* Big emoji */}
              <div className={styles.previewEmoji}>{t.emoji}</div>

              {/* Active badge */}
              {theme === t.key && (
                <div className={styles.activeBadge}>active ✓</div>
              )}
            </div>

            {/* Info */}
            <div className={styles.info}>
              <div className={styles.infoTop}>
                <span className={styles.themeEmoji}>{t.emoji}</span>
                <span className={styles.themeName}>{t.label}</span>
              </div>
              <p className={styles.themeDesc}>{t.desc}</p>

              {/* Color swatches */}
              <div className={styles.swatches}>
                {t.colors.map((c, i) => (
                  <div
                    key={i}
                    className={styles.swatch}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

          </button>
        ))}
      </div>

    </div>
  )
}
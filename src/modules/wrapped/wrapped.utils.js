// Get most common item in array
export const getMostCommon = (arr) => {
  if (!arr.length) return null
  const freq = arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]
}

// Get mood display info
export const getMoodInfo = (mood) => {
  const map = {
    happy:   { emoji: '😊', label: 'happy',   color: '#f59e0b' },
    sad:     { emoji: '🥲', label: 'sad',     color: '#7aaeed' },
    calm:    { emoji: '😌', label: 'calm',    color: '#6ee7b7' },
    sleepy:  { emoji: '😴', label: 'sleepy',  color: '#a78bfa' },
    angry:   { emoji: '😤', label: 'angry',   color: '#f87171' },
    anxious: { emoji: '😰', label: 'anxious', color: '#fb923c' },
    loved:   { emoji: '🥰', label: 'loved',   color: '#e8729a' },
    bleh:    { emoji: '😑', label: 'bleh',    color: '#94a3b8' },
  }
  return map[mood] || { emoji: '💭', label: mood, color: '#94a3b8' }
}

// Get platform info
export const getPlatformEmoji = (platform) => {
  const map = {
    youtube:    '🎬',
    spotify:    '🎵',
    instagram:  '📸',
    soundcloud: '🎧',
    link:       '🔗',
  }
  return map[platform] || '🔗'
}

// Generate a personal message based on stats
export const getWrappedMessage = (stats) => {
  const { totalJournals, totalMemories, totalLetters } = stats

  if (totalJournals > 20) return "you journaled SO much this year 📖 proud of you"
  if (totalMemories > 15) return "you captured so many beautiful moments 📸"
  if (totalLetters > 5)   return "future you is going to love reading these 💌"
  if (totalJournals > 5)  return "every entry you wrote mattered 🌷"
  return "this is just the beginning of your story 🌷"
}
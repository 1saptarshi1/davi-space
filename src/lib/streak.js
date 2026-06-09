// Calculate current streak from journal entries
export const calculateStreak = (entries) => {
  if (!entries.length) return 0

  // Get unique dates (just YYYY-MM-DD)
  const dates = [...new Set(
    entries.map(e => new Date(e.created_at).toLocaleDateString('en-CA'))
  )].sort().reverse() // newest first

  const today = new Date().toLocaleDateString('en-CA')
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA')

  // Must have written today or yesterday to have an active streak
  if (dates[0] !== today && dates[0] !== yesterday) return 0

  let streak = 1
  for (let i = 0; i < dates.length - 1; i++) {
    const curr = new Date(dates[i])
    const next = new Date(dates[i + 1])
    const diff = (curr - next) / 86400000

    if (diff === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export const getStreakMessage = (streak) => {
  if (streak === 0) return 'start your streak today 🌷'
  if (streak === 1) return 'streak started! keep going 🌷'
  if (streak < 5)  return `${streak} days strong 🔥`
  if (streak < 10) return `${streak} days! you're on fire 🔥`
  if (streak < 30) return `${streak} days!! incredible 🔥`
  return `${streak} days!!! legend 🌷🔥`
}
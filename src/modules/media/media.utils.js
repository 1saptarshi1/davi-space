// Detect platform from URL
export const detectPlatform = (url) => {
  if (!url) return 'unknown'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('spotify.com')) return 'spotify'
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('soundcloud.com')) return 'soundcloud'
  return 'link'
}

// Get platform display info
export const getPlatformInfo = (platform) => {
  const map = {
    youtube:    { label: 'YouTube',    emoji: '🎬', color: '#ff4444' },
    spotify:    { label: 'Spotify',    emoji: '🎵', color: '#1db954' },
    instagram:  { label: 'Instagram',  emoji: '📸', color: '#e1306c' },
    soundcloud: { label: 'SoundCloud', emoji: '🎧', color: '#ff5500' },
    link:       { label: 'Link',       emoji: '🔗', color: '#7aaeed' },
    unknown:    { label: 'Link',       emoji: '🔗', color: '#7aaeed' },
  }
  return map[platform] || map.link
}

// Extract YouTube embed URL
export const getYouTubeEmbed = (url) => {
  let videoId = null

  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0]
  } else if (url.includes('v=')) {
    videoId = url.split('v=')[1]?.split('&')[0]
  }

  return videoId
    ? `https://www.youtube.com/embed/${videoId}`
    : null
}

// Extract Spotify embed URL
export const getSpotifyEmbed = (url) => {
  // Convert open.spotify.com/track/xxx to embed
  const match = url.match(/spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/)
  if (!match) return null
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`
}

// Get thumbnail for YouTube
export const getYouTubeThumbnail = (url) => {
  let videoId = null
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0]
  } else if (url.includes('v=')) {
    videoId = url.split('v=')[1]?.split('&')[0]
  }
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : null
}
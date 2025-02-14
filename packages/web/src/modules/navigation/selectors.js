export const TabIcon = (state) => ({
  badges: {
    '/feed': state.feed.hasBadge,
    '/notifications': state.notifications.hasBadge,
    '/tells': state.tells.hasBadge,
  },
  profile: {
    avatarFileName: state.profile.profile.avatarFileName,
    tintColor: state.profile.profile.tintColor,
    username: state.profile.profile.username,
  },
})

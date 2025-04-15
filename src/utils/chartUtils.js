export const formatDomainData = (activityData) => {
    return Object.entries(activityData)
      .map(([domain, seconds]) => ({
        name: domain,
        value: Math.floor(seconds / 60) // Convert to minutes
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Show top 10 domains
  }
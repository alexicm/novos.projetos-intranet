let inactivityTimer: NodeJS.Timeout | null = null
const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes

export const resetInactivityTimer = (onInactive: () => void) => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
  inactivityTimer = setTimeout(onInactive, INACTIVITY_TIMEOUT)
}

export const clearInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
  }
}

export const setupInactivityListeners = (onInactive: () => void) => {
  const resetTimer = () => resetInactivityTimer(onInactive)

  window.addEventListener("mousemove", resetTimer)
  window.addEventListener("keydown", resetTimer)
  window.addEventListener("click", resetTimer)
  window.addEventListener("scroll", resetTimer)
  window.addEventListener("touchstart", resetTimer)

  return () => {
    window.removeEventListener("mousemove", resetTimer)
    window.removeEventListener("keydown", resetTimer)
    window.removeEventListener("click", resetTimer)
    window.removeEventListener("scroll", resetTimer)
    window.removeEventListener("touchstart", resetTimer)
    clearInactivityTimer()
  }
}


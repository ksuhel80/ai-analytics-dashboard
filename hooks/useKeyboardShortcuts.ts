import { useEffect } from 'react'

interface ShortcutHandlers {
  onNew?: () => void
  onToggleSidebar?: () => void
  onSwitchTab?: (tabIndex: number) => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return
      }

      const key = e.key.toLowerCase()

      if (key === 'n' && handlers.onNew) {
        e.preventDefault()
        handlers.onNew()
      }

      if (key === 't' && handlers.onToggleSidebar) {
        e.preventDefault()
        handlers.onToggleSidebar()
      }

      if (['1', '2', '3', '4'].includes(key) && handlers.onSwitchTab) {
        e.preventDefault()
        handlers.onSwitchTab(parseInt(key) - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}

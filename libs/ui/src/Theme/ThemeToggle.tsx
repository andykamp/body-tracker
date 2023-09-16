import { Button } from '@geist-ui/core'
import { Moon, Sun } from '@geist-ui/icons'
import { useTheme } from './ThemeProvider'

function ThemeToggle() {
  const { themeType, switchTheme } = useTheme()

  const onToggle = () => {
    switchTheme(themeType === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      aria-label="Toggle Theme Mode"
      iconRight={themeType === 'dark' ? <Sun /> : <Moon />}
      onClick={onToggle}
      auto
      scale={0.5}
    />
  )
}

export default ThemeToggle

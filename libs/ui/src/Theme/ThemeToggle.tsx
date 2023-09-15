import { Button } from '@geist-ui/core'
import { Moon, Sun } from '@geist-ui/icons'
import { useTheme } from './ThemeProvider'

function ThemeToggle() {
  const { themeType, switchTheme } = useTheme()

  const onToggle = ()=>{
    switchTheme(themeType === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      {/* <div className="absolute top-6 right-6 bg-black dark:bg-white text-white dark:text-black w-60 h-60"> */}
      {/*   hloooooooooe */}
      {/* </div> */}
      <div className=" absolute top-60 right-60 bg-bg1 text-fg1">
        hloooooooooe
      </div>
    <Button
      aria-label="Toggle Theme Mode"
      iconRight={themeType === 'dark' ? <Sun /> : <Moon />}
      onClick={onToggle}
      auto
      scale={0.5}
    />
    </>
  )
}

export default ThemeToggle

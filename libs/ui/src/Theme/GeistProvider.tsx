import { ComponentProps } from 'react'
import {ThemeType} from './ThemeProvider'
import { GeistProvider, CssBaseline, Themes } from '@geist-ui/core'

export type ThemeProviderProps = ComponentProps<'div'> & {
 themes?: any
 themeType?: ThemeType
}

function ThemeProvider(props: ThemeProviderProps) {
  const {
    children,
    themes,
    themeType
  } = props

    console.log('themeType',themeType );
  return (
    <GeistProvider
      themes={themes || Themes}
      themeType={themeType}
    >
      <CssBaseline />
      {children}
    </GeistProvider>
  )
}
export default ThemeProvider

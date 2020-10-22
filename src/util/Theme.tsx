import { createMuiTheme } from '@material-ui/core'
import { createContext } from 'react'

type ThemeOptions = 'light' | 'dark'
const ThemeContext = createContext<ThemeOptions>('light')

export const 

export const getTheme = () => {
  return createMuiTheme({
    typography: {
      h1: {
        fontSize: 32,
      },
    },
  })
}

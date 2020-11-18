import React, { Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { createMuiTheme } from '@material-ui/core'
import { createContext } from 'react'
import { blue, cyan } from '@material-ui/core/colors'

type ThemeOptions = 'light' | 'dark'
type Context = [ThemeOptions, Dispatch<SetStateAction<ThemeOptions>>]
const ThemeContext = createContext<Context>(['light', () => {}])

export const ColorThemeProvider = ({ children }: { children: ReactNode }) => {
  const state = useState<ThemeOptions>(
    () => (localStorage.getItem('theme') as ThemeOptions) || 'light',
  )
  return <ThemeContext.Provider value={state}>{children}</ThemeContext.Provider>
}

export const useColorTheme = () => {
  const [color, setColor] = useContext(ThemeContext)
  useEffect(() => {
    localStorage.setItem('theme', color)
  }, [color])

  return { setColor, color }
}

export const getTheme = (color: ThemeOptions) => {
  return createMuiTheme({
    palette: {
      primary: color === 'dark' ? cyan : blue,
      type: color,
    },
    typography: {
      h1: {
        fontSize: 32,
      },
    },
  })
}

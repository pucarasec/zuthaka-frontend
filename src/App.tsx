import React from 'react'
import Main from './routes/Main'
import { SnackbarProvider } from 'notistack'
import { createMuiTheme, ThemeProvider, useMediaQuery } from '@material-ui/core'
import { getTheme } from './util/Theme'
import { CrudProvider, enUS } from 'material-crud'
import { cyan, purple } from '@material-ui/core/colors'

export default () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  console.log(prefersDarkMode)
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: cyan,
          type: 'dark',
        },
      }),
    [],
  )

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <CrudProvider lang={enUS}>
          <Main />
        </CrudProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

import React, { useState } from 'react'
import Main from './routes/Main'
import { SnackbarProvider } from 'notistack'
import { ThemeProvider } from '@material-ui/core'
import { getTheme, useColorTheme } from './util/Theme'
import { CrudProvider, enUS } from 'material-crud'
import Storage from './util/Storage'

export default () => {
  const [user, setUser] = useState(() => Storage.getItem('User'))
  const { color } = useColorTheme()

  return (
    <ThemeProvider theme={getTheme(color)}>
      <SnackbarProvider maxSnack={3}>
        <CrudProvider
          lang={enUS}
          user={user}
          onUser={(newUser) => {
            if (newUser) {
              setUser(newUser)
              Storage.saveItem('User', newUser)
            } else if (newUser === null) {
              setUser(null)
              Storage.removeItem('User')
            }
          }}>
          <Main />
        </CrudProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

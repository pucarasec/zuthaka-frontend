import React, { useState } from 'react'
import Main from './routes/Main'
import { SnackbarProvider } from 'notistack'
import { ThemeProvider } from '@material-ui/core'
import { getTheme, useColorTheme } from './util/Theme'
import { CrudProvider, enUS } from 'material-crud'
import Storage from './util/Storage'
import { LoginResponse } from './screens/Login'
import { LoggingProvider } from './util/LoggingContext'
import { ResponsiveProvider } from './util/ResponsiveContext'

export default () => {
  const [user, setUser] = useState(Storage.getItem<LoginResponse>('User'))
  const { color } = useColorTheme()

  return (
    <ThemeProvider theme={getTheme(color)}>
      <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} maxSnack={3}>
        <CrudProvider
          lang={enUS}
          user={user}
          headers={{ authorization: user ? `Bearer ${user.token}` : undefined }}
          onUser={(newUser) => {
            setUser(newUser)
            if (newUser) Storage.saveItem('User', newUser)
            else Storage.removeItem('User')
          }}>
          <LoggingProvider>
            <ResponsiveProvider>
              <Main />
            </ResponsiveProvider>
          </LoggingProvider>
        </CrudProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

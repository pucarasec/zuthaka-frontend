import React from 'react'
import Main from './routes/Main'
import { SnackbarProvider } from 'notistack'
import { ThemeProvider } from '@material-ui/core'
import { getTheme } from './util/Theme'
import { CrudProvider, enUS } from 'material-crud'

export default () => {
	return (
		<ThemeProvider theme={getTheme()}>
			<SnackbarProvider maxSnack={3}>
				<CrudProvider lang={enUS}>
					<Main />
				</CrudProvider>
			</SnackbarProvider>
		</ThemeProvider>
	)
}

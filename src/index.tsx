import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { ColorThemeProvider } from './util/Theme'

const WithColorProvider = () => {
  return (
    <ColorThemeProvider>
      <App />
    </ColorThemeProvider>
  )
}

ReactDOM.render(<WithColorProvider />, document.getElementById('root'))
serviceWorker.unregister()

import React from 'react'
import './index.css'

import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { ColorThemeProvider } from './util/Theme'
import { setChonkyDefaults } from 'chonky'
import { ChonkyIconFA } from 'chonky-icon-fontawesome'

const WithColorProvider = () => {
  return (
    <ColorThemeProvider>
      <App />
    </ColorThemeProvider>
  )
}

setChonkyDefaults({ iconComponent: ChonkyIconFA })
ReactDOM.render(<WithColorProvider />, document.getElementById('root'))
serviceWorker.unregister()

import React from 'react'
import { FileManager, FileNavigator } from '@opuscapita/react-filemanager'

export default () => {
  return (
    <div style={{ height: '480px' }}>
      <FileManager>
        <FileNavigator id="filemanager-1" />
      </FileManager>
    </div>
  )
}

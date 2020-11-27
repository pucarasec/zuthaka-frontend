import { useNavigatorConfig } from 'material-navigator'
import React from 'react'

export default () => {
  useNavigatorConfig({ title: 'Dashboard', noPadding: false })
  
  return <span>DASHBOARD</span>
}

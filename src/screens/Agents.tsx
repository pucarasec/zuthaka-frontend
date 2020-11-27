import { makeStyles } from '@material-ui/core'
import { useNavigatorConfig } from 'material-navigator'
import React from 'react'
import { createColumns, Crud } from 'material-crud'
import FullCrud from '../components/FullCrud'
import Urls from '../util/Urls'

export default () => {
  useNavigatorConfig({ title: 'Agents', noPadding: false })

  const classes = useClasses()

  const columns = createColumns([{ id: 'id', title: 'ID' }])

  return <FullCrud columns={columns} url={Urls.agents} name="Agents" />
}

const useClasses = makeStyles((theme) => ({}))

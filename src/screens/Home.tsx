import React, { useMemo } from 'react'
import { useNavigatorConfig } from 'material-navigator'
import Urls from '../util/Urls'
import FullCrud from '../components/FullCrud'
import { createColumns, TableTypes } from 'material-crud'
import Charts from '../util/Charts'
import { makeStyles } from '@material-ui/core'

const Home = () => {
  useNavigatorConfig({ title: 'Dashboard', noPadding: false })
  const classes = useClasses()

  const columns = useMemo(
    () =>
      createColumns([
        { id: 'command_ref', title: 'Command Ref', type: TableTypes.String },
        { id: 'creation_date', title: 'Creation date', type: TableTypes.Date },
      ]),
    [],
  )

  return (
    <div>
      <Charts />
      <FullCrud
        url={Urls.tasks}
        columns={columns}
        name="Tasks"
        actions={{ delete: false }}
        rowStyle={(rowData) => {
          if (rowData.completed) return classes.completado
          return classes.noCompletado
        }}
      />
    </div>
  )
}

const useClasses = makeStyles((theme) => ({
  completado: {
    backgroundColor: theme.palette.success['light'],
  },
  noCompletado: {
    backgroundColor: theme.palette.warning['light'],
  },
}))

export default Home

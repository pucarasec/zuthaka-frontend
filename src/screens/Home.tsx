import React, { useMemo } from 'react'
import { useNavigatorConfig } from 'material-navigator'
import Urls from '../util/Urls'
import FullCrud from '../components/FullCrud'
import { createColumns, TableTypes } from 'material-crud'
import Charts from '../util/Charts'

const Home = () => {
  useNavigatorConfig({ title: 'Dashboard', noPadding: false })

  const columns = useMemo(
    () =>
      createColumns([
        { id: 'command_ref', title: 'Command Ref', type: TableTypes.String, width: 4 },
        { id: 'creation_date', title: 'Creation date', type: TableTypes.Date, width: 3 },
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
        actions={{ pinToTop: true }}
        rowStyle={(rowData) => {
          if (rowData.completed) return { backgroundColor: 'forestgreen' }
          return { backgroundColor: 'darkorange' }
        }}
      />
    </div>
  )
}

export default Home

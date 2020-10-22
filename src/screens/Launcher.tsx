import React from 'react'
import { Crud, Types, createFields, useWindowSize } from 'material-crud'

interface LauncherProps {
  id: string
  cTwo: string
  listener: string
  type: string
  creationDate: string
  actions: string
}

const fields = createFields(() => [
  {
    id: 'c2_id_query',
    type: Types.Options,
    options: [
      { id: '1', title: 'Empire' },
      { id: '2', title: 'OTRO' },
      { id: '3', title: 'TERCERO' },
    ],
    title: 'C2',
    placeholder: 'Select one C2',
  },
  {
    id: 'type',
    type: Types.Options,
    options: [
      { id: '1', title: 'HTTP' },
      { id: '2', title: 'HTTPS' },
    ],
    title: 'Types',
    placeholder: 'Select one type',
  },
])

export default () => {
  const { height } = useWindowSize()

  return (
    <Crud
      height={height}
      description="Launcher"
      name="Launcher"
      url="http://127.0.0.1:8000/launcher/type"
      edit
      deleteRow
      itemId="id"
      idInUrl
      columns={fields}
      response={{
        list: (cList) => ({
          items: cList.results,
          page: 1,
          limit: -1,
          totalDocs: cList.count,
        }),
        new: (data, response) => ({ ...data, id: response[0].id }),
        edit: (data, response) => data,
      }}
    />
  )
}

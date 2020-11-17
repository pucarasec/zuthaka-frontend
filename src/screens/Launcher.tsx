import React, { useEffect, useMemo, useState } from 'react'
import {
  Crud,
  createFields,
  useWindowSize,
  createColumns,
  TableTypes,
  useAxios,
  FormTypes,
  callWs,
} from 'material-crud'
import Urls from '../util/Urls'
import { crudInteractions, crudResponse } from '../util/CrudConfig'
import { crudError, crudFinised } from '../util/addOns'
import { useSnackbar } from 'notistack'
import usePins from '../hooks/usePins'
import { Tooltip, IconButton } from '@material-ui/core'
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai'

export default () => {
  const { height } = useWindowSize()
  const { call, response } = useAxios()
  const { enqueueSnackbar } = useSnackbar()
  const [listeners, setListeners] = useState<any[]>([])
  const { pins, savePins, removePins } = usePins('launcher')

  useEffect(() => {
    call({ url: Urls.launcher_type, method: 'GET' })
    const getListeners = async () => {
      const { response } = await callWs<any>({
        url: Urls.listeners,
        method: 'GET',
      })
      if (response?.results) setListeners(response?.results)
    }
    getListeners()
  }, [call])

  const columns = useMemo(
    () =>
      createColumns([
        {
          id: 'id',
          type: TableTypes.String,
          title: 'ID',
        },
      ]),
    [],
  )

  const fields = useMemo(
    () =>
      createFields([
        {
          id: 'listener_id',
          title: 'Listener',
          type: FormTypes.Options,
          placeholder: 'Select one listener',
          options: listeners?.map(({ type, id }: any) => ({ id, title: `${type} (${id})` })),
        },
        {
          id: 'type',
          title: 'Type',
          type: FormTypes.Options,
          placeholder: 'Select one type',
          options: response?.results?.map(({ name, id }: any) => ({ id: name })) || [],
        },
        {
          id: 'options',
          title: 'Options',
          type: FormTypes.Multiple,
          configuration: [
            { id: 'name', type: FormTypes.Input, title: 'Name' },
            { id: 'value', type: FormTypes.Input, title: 'Value' },
          ],
        },
      ]),
    [response, listeners],
  )

  return (
    <Crud
      height={height - 200}
      description="Launcher"
      name="Launcher"
      url={Urls.launcher}
      actions={{ edit: true, delete: true }}
      itemId="id"
      idInUrl
      columns={columns}
      fields={fields}
      response={crudResponse}
      interaction={crudInteractions}
      onError={crudError(enqueueSnackbar)}
      onFinished={crudFinised(enqueueSnackbar, 'Launcher')}
      extraActions={(rowData: any) => {
        const isMarked = pins.includes(rowData.id)
        return [
          <Tooltip title="Pin to top" key={rowData.id}>
            <IconButton onClick={() => (isMarked ? removePins(rowData.id) : savePins(rowData.id))}>
              {isMarked ? <AiFillPushpin /> : <AiOutlinePushpin />}
            </IconButton>
          </Tooltip>,
        ]
      }}
    />
  )
}

import React, { useEffect, useMemo } from 'react'
import { createFields, createColumns, TableTypes, FormTypes } from 'material-crud'
import Urls from '../util/Urls'
import usePins from '../hooks/usePins'
import { Tooltip, IconButton } from '@material-ui/core'
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import FullCrud, { WSResponse } from '../components/FullCrud'
import useAxios from '../util/useAxios'

export default () => {
  useNavigatorConfig({ title: 'Launchers', noPadding: false })
  const { setLoading } = useNavigator()

  const [listeners, loadingListeners] = useAxios<WSResponse>({
    onInit: {
      url: Urls.listeners,
    },
  })

  const [types, loadingTypes] = useAxios<WSResponse>({
    onInit: {
      url: Urls.launcher_type,
    },
  })

  const { pins, savePins, removePins } = usePins('launcher')

  useEffect(() => {
    setLoading(loadingListeners || loadingTypes)
  }, [loadingListeners, loadingTypes, setLoading])

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
          options: listeners?.results.map(({ type, id }: any) => ({
            id,
            title: `${type} (${id})`,
          })),
        },
        {
          id: 'type',
          title: 'Type',
          type: FormTypes.Options,
          placeholder: 'Select one type',
          options: types?.results?.map(({ name, id }: any) => ({ id: name })) || [],
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
    [listeners, types],
  )

  return (
    <React.Fragment>
      {pins.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 100,
            marginRight: 100,
            marginBottom: 30,
          }}>
          {pins.map((id) => (
            <span key={id}>{id}</span>
          ))}
        </div>
      )}
      <FullCrud
        description="Launcher"
        name="Launcher"
        url={Urls.launcher}
        itemId="id"
        columns={columns}
        fields={fields}
        extraActions={(rowData: any) => {
          const isMarked = pins.includes(rowData.id)
          return [
            <Tooltip title="Pin to top" key={rowData.id}>
              <IconButton
                onClick={() => (isMarked ? removePins(rowData.id) : savePins(rowData.id))}>
                {isMarked ? <AiFillPushpin /> : <AiOutlinePushpin />}
              </IconButton>
            </Tooltip>,
          ]
        }}
      />
    </React.Fragment>
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { createFields, createColumns, TableTypes, FormTypes } from 'material-crud'
import Urls from '../util/Urls'
import usePins from '../hooks/usePins'
import { Tooltip, IconButton } from '@material-ui/core'
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import FullCrud, { renderType, WSResponse } from '../components/FullCrud'
import useAxios from '../util/useAxios'
import * as Yup from 'yup'
import { FieldProps } from 'material-crud/dist/components/Form/FormTypes'

export default () => {
  useNavigatorConfig({ title: 'Launchers', noPadding: false })
  const { setLoading } = useNavigator()

  const [listenersTypes, loadingListeners] = useAxios<WSResponse>({
    onInit: {
      url: Urls.listeners_types,
    },
  })

  const [types, loadingTypes] = useAxios<WSResponse<any[]>>({
    onInit: {
      url: Urls.launcher_type,
    },
  })

  const { pins, savePins, removePins } = usePins('launcher')
  const [selectedType, setSelectedType] = useState('')

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
        {
          id: 'listener_name',
          type: TableTypes.String,
          title: 'Listener Name',
          cellComponent: ({ rowData }) =>
            types?.results.find((x: any) => x.id === rowData.id)?.name || '-',
          width: 2,
        },
        {
          id: 'listener_id',
          type: TableTypes.String,
          title: 'Listener ID',
        },
        {
          id: 'listener_name',
          type: TableTypes.String,
          title: 'Listener Name',
          cellComponent: ({ rowData }) =>
            listenersTypes?.results.find((x: any) => x.id === rowData.listener_id)?.name || '-',
          width: 1,
        },
      ]),
    [types, listenersTypes],
  )

  const fields = useMemo(
    () =>
      createFields([
        {
          id: 'listener_id',
          title: 'Listener',
          type: FormTypes.Options,
          placeholder: 'Select one listener',
          options: listenersTypes?.results.map(({ name, id }: any) => ({
            id: id.toString(),
            title: `${name} (${id})`,
          })),
        },
        {
          id: 'type',
          title: 'Type',
          type: FormTypes.Options,
          placeholder: 'Select one type',
          options:
            types?.results?.map(({ name, id }: any) => ({ id: id.toString(), title: name })) || [],
          onSelect: (val) => setSelectedType(val as string),
        },
        types?.results.reduce((final, { id: typeId, options }): FieldProps[] => {
          const item = options.map(
            ({ id, type, name, description }: any): FieldProps => ({
              id,
              type: renderType(type),
              title: name,
              help: description || '',
            }),
          )
          return [...final, item]
        }, []),
        // {
        //   id: 'options',
        //   title: 'Options',
        //   type: FormTypes.Multiple,
        //   configuration: !selectedType
        //     ? [{ id: 'empty', type: FormTypes.OnlyTitle, title: 'Select one type first' }]
        //     : types?.results
        //         .find((x: any) => x.id.toString() === selectedType)
        //         .options.map(({ name, type, required, description }: any) => ({
        //           id: name,
        //           title: name,
        //           type: renderType(type),
        //           help: description,
        //           validate:
        //             required.toLowerCase() === 'true'
        //               ? Yup.string().required('Campo obligatorio')
        //               : false,
        //         })),
        // },
      ]),
    [listenersTypes, types, selectedType],
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

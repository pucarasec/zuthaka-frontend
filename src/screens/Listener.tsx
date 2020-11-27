import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import * as Yup from 'yup'
import { createColumns, createFields, FormTypes, TableTypes } from 'material-crud'
import { IconButton, Tooltip } from '@material-ui/core'
import { AiOutlinePushpin, AiFillPushpin } from 'react-icons/ai'
import usePins from '../hooks/usePins'
import Urls from '../util/Urls'
import { FaChevronCircleDown, FaChevronCircleUp, FaRegBookmark } from 'react-icons/fa'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import FullCrud, { renderType, WSResponse } from '../components/FullCrud'
import useAxios from '../util/useAxios'
import { useHistory } from 'react-router-dom'

interface ListenerProps {
  id: number
  c2_id: number
  type: string
  options: { name: string; value: string }[]
}

const PinTop = memo(({ id }: any) => {
  const [listener] = useAxios<ListenerProps>({
    onInit: {
      url: `${Urls.listeners}/${id}`,
    },
  })

  return (
    <div style={{ display: 'flex' }}>
      <span>ID: {listener?.id}</span>
      <span>C2_ID: {listener?.c2_id}</span>
      <span>Type: {listener?.type}</span>
      <span>Options: {listener?.options.map(({ name, value }) => `${name} (${value})`)}</span>
    </div>
  )
})

export default () => {
  useNavigatorConfig({ title: 'Listeners', noPadding: false })
  const { setLoading } = useNavigator()
  const { location } = useHistory()

  const [listenerTypes, loadingTypes] = useAxios<WSResponse<any[]>>({
    onInit: {
      url: Urls.listeners_types,
    },
  })
  const [c2Types, loadingC2] = useAxios<WSResponse<any[]>>({
    onInit: {
      url: Urls.c2_types,
    },
  })

  useEffect(() => {
    setLoading(loadingC2 || loadingTypes)
  }, [loadingC2, loadingTypes, setLoading, location])

  const { pins, savePins, removePins } = usePins('listener')
  const [selectedType, setSelectedType] = useState('')

  const columns = useMemo(
    () =>
      createColumns([
        {
          id: 'options',
          title: 'Options',
          type: TableTypes.Custom,
          height: 100,
          cellComponent: ({ expandRow, isExpanded }) => (
            <IconButton onClick={expandRow}>
              {isExpanded ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
            </IconButton>
          ),
          content: (rowData) =>
            !rowData?.options.length
              ? 'No rows'
              : rowData?.options.map(({ name, value }: any) => (
                  <span key={name}>
                    {name} ({value})
                  </span>
                )),
        },
        {
          id: 'id',
          type: TableTypes.String,
          title: 'ID',
          width: 1,
        },
        {
          id: 'c2_id',
          type: TableTypes.String,
          title: 'C2',
          width: 1,
        },
        {
          id: 'c2_name',
          type: TableTypes.String,
          title: 'C2 Name',
          cellComponent: ({ rowData }) =>
            c2Types?.results.find((x) => x.id === rowData.c2_id)?.name || '-',
          width: 1,
        },
        {
          id: 'type',
          type: TableTypes.String,
          title: 'Type',
          cellComponent: ({ rowData }) =>
            listenerTypes?.results.find((x) => x.id === rowData.listener_type)?.name || '-',
          width: 3,
        },
      ]),
    [c2Types, listenerTypes],
  )

  const filters = useMemo(
    () =>
      createFields([
        {
          id: 'c2_id',
          type: FormTypes.Options,
          options:
            c2Types?.results.map(({ name, id }: any) => ({
              id,
              title: `${name} (${id})`,
            })) || [],
          title: 'C2',
          placeholder: 'Select one C2',
        },
        {
          id: 'listener_type',
          type: FormTypes.Options,
          options:
            listenerTypes?.results.map(({ name, id }: any) => ({ id, title: `${name} (${id})` })) ||
            [],
          title: 'Listener type',
          placeholder: 'Select one Listener type',
        },
        {
          id: 'created_since',
          type: FormTypes.Date,
          title: 'Created Since',
        },
        {
          id: 'created_until',
          type: FormTypes.Date,
          title: 'Created Until',
        },
      ]),
    [c2Types, listenerTypes],
  )

  const fields = useMemo(
    () =>
      createFields([
        {
          id: 'c2_id',
          type: FormTypes.Options,
          validate: Yup.string().required(),
          options:
            c2Types?.results.map(({ name, id }) => ({
              id: id.toString(),
              title: `${name} (${id})`,
            })) || [],
          title: 'C2',
          placeholder: 'Select one C2',
        },
        {
          id: 'type',
          type: FormTypes.Options,
          title: 'Type',
          validate: Yup.string().required(),
          options:
            listenerTypes?.results.map(({ id, name }) => ({ id: id.toString(), title: name })) ||
            [],
          placeholder: 'Select one type',
          onSelect: (val) => setSelectedType(val as string),
        },
        {
          id: 'options',
          title: 'Options',
          type: FormTypes.Multiple,
          configuration: !selectedType
            ? [{ id: 'empty', type: FormTypes.OnlyTitle, title: 'Select one type first' }]
            : listenerTypes?.results
                .find((x: any) => x.id.toString() === selectedType)
                .options.map(({ name, type, required, description }: any) => ({
                  id: name,
                  title: name,
                  type: renderType(type),
                  help: description,
                  validate:
                    required.toLowerCase() === 'true'
                      ? Yup.string().required('Campo obligatorio')
                      : false,
                })),
        },
      ]),
    [c2Types, listenerTypes, selectedType],
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
            <PinTop key={id} id={id} />
          ))}
        </div>
      )}
      <FullCrud
        columns={columns}
        fields={fields}
        filters={filters}
        description="Listener"
        name="Listener"
        url={Urls.listeners}
        itemId="id"
        idInUrl
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
        // showSelecting
        rightToolbar={({ rowsSelected }) => (
          <IconButton onClick={() => savePins(rowsSelected.map(({ id }) => id))}>
            <FaRegBookmark />
          </IconButton>
        )}
      />
    </React.Fragment>
  )
}

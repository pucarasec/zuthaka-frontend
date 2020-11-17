import React, { memo, useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
import {
  callWs,
  createColumns,
  createFields,
  Crud,
  FormTypes,
  TableTypes,
  useWindowSize,
} from 'material-crud'
import { IconButton, Tooltip } from '@material-ui/core'
import { AiOutlinePushpin, AiFillPushpin } from 'react-icons/ai'
import usePins from '../hooks/usePins'
import { crudInteractions, crudResponse } from '../util/CrudConfig'
import Urls from '../util/Urls'
import { useLocation } from 'react-router-dom'
import { FaChevronCircleDown, FaChevronCircleUp, FaRegBookmark } from 'react-icons/fa'

interface ListenerProps {
  id: number
  c2_id: number
  type: string
  options: { name: string; value: string }[]
}

const PinTop = memo(({ id }: any) => {
  const [listener, setListener] = useState<ListenerProps | null>(null)

  useEffect(() => {
    const getListener = async () => {
      const { response } = await callWs<any>({
        url: `${Urls.listeners}/${id}`,
        method: 'GET',
      })
      setListener(response)
    }
    getListener()
  }, [id])

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
  const { height } = useWindowSize()
  const { state } = useLocation()
  const [types, setTypes] = useState<any[]>([])
  const [c2, setC2] = useState<any[]>([])
  const { pins, savePins, removePins } = usePins('listener')

  useEffect(() => {
    const getTypes = async () => {
      const { response } = await callWs<any>({
        url: Urls.listeners_types,
        method: 'GET',
      })
      if (response?.results) setTypes(response?.results)
    }
    getTypes()
    const getC2 = async () => {
      const { response } = await callWs<any>({
        url: Urls.c2,
        method: 'GET',
      })
      if (response?.results) setC2(response?.results)
    }
    getC2()
  }, [])

  useEffect(() => {
    console.log(state)
    if (state) {
    }
  }, [state])

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
          cellComponent: ({ rowData }) => c2.find((x) => x.id === rowData.c2_id)?.type || '-',
          width: 1,
        },
        {
          id: 'type',
          type: TableTypes.String,
          title: 'Type',
          width: 3,
        },
      ]),
    [c2],
  )

  const filters = useMemo(
    () =>
      createFields([
        {
          id: 'c2_id',
          type: FormTypes.Options,
          options: c2.map(({ type, id }: any) => ({ id, title: `${type} (${id})` })),
          title: 'C2',
          placeholder: 'Select one C2',
        },
      ]),
    [c2],
  )

  const fields = useMemo(
    () =>
      createFields([
        {
          id: 'c2_id',
          type: FormTypes.Options,
          validate: Yup.string().required(),
          options: c2.map(({ type, id }: any) => ({ id, title: `${type} (${id})` })),
          title: 'C2',
          placeholder: 'Select one C2',
        },
        {
          id: 'type',
          type: FormTypes.Options,
          title: 'Type',
          validate: Yup.string().required(),
          options: types.map(({ name }: any) => ({ id: name })),
          placeholder: 'Select one type',
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
    [c2, types],
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
      <Crud
        height={height - 250}
        columns={columns}
        fields={fields}
        filters={filters}
        description="Listener"
        name="Listener"
        url={Urls.listeners}
        actions={{ edit: true, delete: true }}
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
        response={crudResponse}
        interaction={crudInteractions}
      />
    </React.Fragment>
  )
}

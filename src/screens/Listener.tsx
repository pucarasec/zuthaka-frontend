import React, { memo, useEffect, useMemo } from 'react'
import * as Yup from 'yup'
import { createColumns, createFields, FormTypes, TableTypes } from 'material-crud'
import { IconButton, Tooltip } from '@material-ui/core'
import { AiOutlinePushpin, AiFillPushpin } from 'react-icons/ai'
import usePins from '../hooks/usePins'
import Urls from '../util/Urls'
import { FaChevronCircleDown, FaChevronCircleUp, FaRegBookmark } from 'react-icons/fa'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import FullCrud, { WSResponse } from '../components/FullCrud'
import useAxios from '../util/useAxios'

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

  const [types, loadingTypes] = useAxios<WSResponse<any[]>>({
    onInit: {
      url: Urls.listeners_types,
    },
  })
  const [c2, loadingC2] = useAxios<WSResponse<any[]>>({
    onInit: {
      url: Urls.listeners_types,
    },
  })

  useEffect(() => {
    setLoading(loadingC2 || loadingTypes)
  }, [loadingC2, loadingTypes, setLoading])

  const { pins, savePins, removePins } = usePins('listener')

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
            c2?.results.find((x) => x.id === rowData.c2_id)?.type || '-',
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
          options: c2?.results.map(({ name, id }: any) => ({ id, title: `${name} (${id})` })) || [],
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
          options: c2?.results.map(({ name, id }) => ({ id, title: `${name} (${id})` })) || [],
          title: 'C2',
          placeholder: 'Select one C2',
        },
        {
          id: 'type',
          type: FormTypes.Options,
          title: 'Type',
          validate: Yup.string().required(),
          options: types?.results.map(({ name }) => ({ id: name })) || [],
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

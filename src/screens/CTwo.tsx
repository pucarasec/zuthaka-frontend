import React, { useEffect, useMemo } from 'react'
import { createColumns, createFields, FormTypes, TableTypes } from 'material-crud'
import { IconButton, Tooltip } from '@material-ui/core'
import { FaChevronCircleDown, FaChevronCircleUp, FaEye } from 'react-icons/fa'
import Urls from '../util/Urls'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import { useHistory } from 'react-router-dom'
import FullCrud, { WSResponse } from '../components/FullCrud'
import useAxios from '../util/useAxios'

export default () => {
  useNavigatorConfig({ title: 'Settings - C2', noPadding: false })
  const { setLoading } = useNavigator()
  const { push } = useHistory()
  const [types, loadingTypes] = useAxios<WSResponse>({
    onInit: {
      url: Urls.c2_types,
    },
  })

  useEffect(() => {
    setLoading(loadingTypes)
  }, [loadingTypes, setLoading])

  const columns = useMemo(
    () =>
      createColumns([
        {
          id: 'expand',
          title: 'Options',
          type: TableTypes.Custom,
          height: 70,
          cellComponent: ({ expandRow, isExpanded }) => {
            return (
              <IconButton onClick={expandRow}>
                {isExpanded ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
              </IconButton>
            )
          },
          content: (rowData) =>
            !rowData?.options.length
              ? 'Without options'
              : rowData?.options.map(({ name, value }: any) => (
                  <span key={name}>{`${name} (${value})`}</span>
                )),
        },
        {
          id: 'type',
          title: 'Type',
          type: TableTypes.String,
        },
        {
          id: 'creation_date',
          title: 'Date',
          type: TableTypes.String,
        },
      ]),
    [],
  )

  const fields = useMemo(
    () =>
      createFields([
        {
          id: 'type',
          title: 'Type',
          type: FormTypes.Options,
          placeholder: 'Select one type',
          options: types?.results.map(({ name }: any) => ({ id: name })) || [],
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
    [types],
  )

  return (
    <FullCrud
      description="C2 example"
      name="C2"
      url={Urls.c2}
      columns={columns}
      fields={fields}
      extraActions={(rowData) => {
        return [
          <Tooltip title="Go to listeners" key={rowData.id}>
            <IconButton onClick={() => push('/listener', { c2_id: rowData.id })}>
              <FaEye />
            </IconButton>
          </Tooltip>,
        ]
      }}
      itemId="id"
      itemName="type"
      idInUrl
    />
  )
}

import React, { useEffect, useMemo, useState } from 'react'
import { createColumns, createFields, FormTypes, TableTypes } from 'material-crud'
import { IconButton, Tooltip } from '@material-ui/core'
import { FaChevronCircleDown, FaChevronCircleUp, FaEye } from 'react-icons/fa'
import Urls from '../util/Urls'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import { useHistory } from 'react-router-dom'
import FullCrud, { renderType, WSResponse } from '../components/FullCrud'
import useAxios from '../util/useAxios'
import * as Yup from 'yup'

export default () => {
  useNavigatorConfig({ title: 'Settings - C2', noPadding: false })
  const { setLoading } = useNavigator()
  const { push } = useHistory()
  const [types, loadingTypes] = useAxios<WSResponse<any[]>>({
    onInit: {
      url: Urls.c2_types,
    },
  })

  const [optionsMultiple, setOptionsMultiple] = useState<any[]>([])

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
          cellComponent: ({ rowData }) =>
            types?.results.find((x) => x.id === rowData.c2_type)?.name || '-',
        },
        {
          id: 'creation_date',
          title: 'Date',
          type: TableTypes.String,
        },
      ]),
    [types],
  )

  const fields = useMemo(
    () =>
      createFields([
        {
          id: 'type',
          title: 'Type',
          type: FormTypes.Options,
          placeholder: 'Select one type',
          options: types?.results.map(({ id, name }: any) => ({ id, title: name })) || [],
          onSelect: (val) => {
            setOptionsMultiple(types?.results.find((x) => x.id === val)?.options || [])
          },
        },
        {
          id: 'options',
          title: 'Options',
          type: FormTypes.Multiple,
          configuration: [],
          // optionsMultiple.length === 0
          //   ? [{ id: 'empty', type: FormTypes.OnlyTitle, title: 'Select one type first' }]
          //   : optionsMultiple.map(({ name, type, required, description }: any) => ({
          //       id: name,
          //       title: name,
          //       type: renderType(type),
          //       help: description || '',
          //       // validate:
          //       //   required.toLowerCase() === 'true' && Yup.string().required('Campo obligatorio'),
          //     })),
        },
      ]),
    [types, optionsMultiple],
  )

  const filters = useMemo(
    () =>
      createFields([
        // {
        //   id: 'c2_id',
        //   type: FormTypes.Options,
        //   options:
        //     types?.results.map(({ name, id }: any) => ({
        //       id,
        //       title: `${name} (${id})`,
        //     })) || [],
        //   title: 'C2',
        //   placeholder: 'Select one C2',
        // },
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
    [],
  )

  return (
    <FullCrud
      description="C2 example"
      name="C2"
      url={Urls.c2}
      filters={filters}
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
      transform={(action, rowData) => {
        if (action === 'new' || action === 'update') {
          return {
            ...rowData,
            options: rowData.options.map((item: any) =>
              Object.keys(item).map((key) => ({ name: key, value: item[key] })),
            ),
          }
        }
        return rowData
      }}
    />
  )
}

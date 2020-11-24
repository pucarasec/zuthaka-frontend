import React, { useEffect, useMemo, useState } from 'react'
import { createColumns, createFields, FormTypes, TableTypes } from 'material-crud'
import { IconButton, Tooltip } from '@material-ui/core'
import { FaChevronCircleDown, FaChevronCircleUp, FaEye } from 'react-icons/fa'
import Urls from '../util/Urls'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import { useHistory } from 'react-router-dom'
import FullCrud, { WSResponse } from '../components/FullCrud'
import useAxios from '../util/useAxios'
import * as Yup from 'yup'

export default () => {
  useNavigatorConfig({ title: 'Settings - C2', noPadding: false })
  const { setLoading } = useNavigator()
  const { push } = useHistory()
  const [types, loadingTypes] = useAxios<WSResponse>({
    onInit: {
      url: Urls.c2_types,
    },
  })

  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
    setLoading(loadingTypes)
  }, [loadingTypes, setLoading])

  const renderType = (type: string): FormTypes => {
    if (type === 'string') return FormTypes.Input
    else if (type === 'integer') return FormTypes.Number

    return FormTypes.OnlyTitle
  }

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
          options: types?.results.map(({ id, name }: any) => ({ id, title: name })) || [],
          onSelect: (val) => setSelectedType(val as string),
        },
        {
          id: 'options',
          title: 'Options',
          type: FormTypes.Multiple,
          configuration: !selectedType
            ? [{ id: 'empty', type: FormTypes.OnlyTitle, title: 'Select one type first' }]
            : types?.results
                .find((x: any) => x.id === selectedType)
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
    [types, selectedType],
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
      transform={(props, rowData) => {
        if (props === 'new' || props === 'update') {
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

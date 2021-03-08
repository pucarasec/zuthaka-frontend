import React, { useEffect, useMemo } from 'react'
import { createColumns, createFields, FormTypes, TableTypes } from 'material-crud'
import { Divider, IconButton, Tooltip, Typography } from '@material-ui/core'
import { FaChevronCircleDown, FaChevronCircleUp, FaEye } from 'react-icons/fa'
import Urls from '../util/Urls'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import { useHistory } from 'react-router-dom'
import FullCrud, { renderType, WSResponse } from '../components/FullCrud'
import useAxios from '../util/useAxios'
import { FieldProps } from 'material-crud/dist/components/Form/FormTypes'
import * as Yup from 'yup'
import DenseTable from '../components/DenseTable'

export default () => {
  useNavigatorConfig({ title: 'Settings - C2', noPadding: false })
  const { setLoading } = useNavigator()
  const { push } = useHistory()
  const [types, loadingTypes] = useAxios<WSResponse<any[]>>({
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
          id: 'id',
          title: 'ID',
          type: TableTypes.String,
          width: 1,
          align: 'center',
        },
        {
          id: 'c2_type',
          title: 'C2 ID',
          type: TableTypes.String,
          width: 1,
          align: 'center',
        },
        {
          id: 'type',
          title: 'Type',
          type: TableTypes.String,
          cellComponent: ({ rowData }) =>
            types?.results.find((x) => x.id === rowData.c2_type)?.name || '-',
          width: 4,
          align: 'center',
        },
        {
          id: 'creation_date',
          title: 'Date',
          type: TableTypes.Date,
          width: 3,
        },
        {
          id: 'expand',
          title: 'Options',
          type: TableTypes.Custom,
          height: 110,
          width: 1,
          cellComponent: ({ expandRow, isExpanded }) => {
            return (
              <IconButton onClick={expandRow}>
                {isExpanded ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
              </IconButton>
            )
          },
          content: (rowData) => {
            if (!rowData?.options.length) return 'Without options'

            const reduced = rowData.options.reduce((acc: any, item: any) => {
              if (Object.keys(acc).length === 0)
                return {
                  columns: [{ title: item.name }],
                  rows: [{ name: item.value }],
                }

              return {
                columns: [...acc.columns, { title: item.name }],
                rows: [...acc.rows, { name: item.value }],
              }
            }, {})

            return (
              <div style={{ width: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Info about <b>Options</b> is displayed below.
                </Typography>
                <Divider />
                <DenseTable columns={reduced.columns} rows={reduced.rows} />
              </div>
            )
          },
        },
      ]),
    [types],
  )

  const fields = useMemo(
    () =>
      createFields([
        {
          id: 'c2_type',
          title: 'Type',
          type: FormTypes.Options,
          placeholder: 'Select one type',
          options: types?.results.map(({ id, name }: any) => ({ id, title: name })) || [],
          validate: Yup.number().required('Required'),
          readonly: 'edit',
        },
        types?.results
          .reduce((final, { id, options }): FieldProps[] => {
            const item = options.map(
              ({ type, name, description, required, example }: any): FieldProps => ({
                id: `${id}-${name}`,
                type: renderType(type),
                title: name,
                help: description ? (
                  <React.Fragment>
                    <Typography color="inherit">{description}</Typography>
                    {example && <em>Example: {example}</em>}
                  </React.Fragment>
                ) : (
                  ''
                ),
                depends: (props) => id === props.c2_type,
                validate:
                  required.toLowerCase() === 'true'
                    ? Yup.string().when('c2_type', {
                        is: (val) => val === id,
                        then: Yup.string().required('Required'),
                        otherwise: Yup.string().notRequired(),
                      })
                    : undefined,
              }),
            )
            return [...final, item]
          }, [])
          ?.flat(),
      ]),
    [types],
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
      actions={{ edit: true, delete: true, pinToTop: true }}
      url={Urls.c2}
      filters={filters}
      columns={columns}
      fields={fields}
      extraActions={(rowData) => {
        return [
          <Tooltip title="Go to listeners" key={rowData.id}>
            <IconButton size="small" onClick={() => push('/listener', { c2_id: rowData.id })}>
              <FaEye />
            </IconButton>
          </Tooltip>,
        ]
      }}
      transform={(action, rowData) => {
        if (action === 'new' || action === 'update') {
          const options = Object.keys(rowData).reduce<any[]>((final, actual) => {
            if (rowData.c2_type.toString() !== actual.split('-')[0]) {
              return final
            }
            const item = { name: actual.split('-')[1], value: rowData[actual] }
            return [...final, item]
          }, [])
          return { ...rowData, options }
        }
        return rowData
      }}
      transformToEdit={(data) => {
        const options = data.options.reduce((final: {}, { name, value }: any) => {
          const item = { [`${data.c2_type}-${name}`]: value }
          return { ...final, ...item }
        }, {})
        return { ...data, ...options }
      }}
    />
  )
}

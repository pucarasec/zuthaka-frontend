import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as Yup from 'yup'
import { createColumns, createFields, CrudRefProps, FormTypes, TableTypes } from 'material-crud'
import { IconButton, Tooltip, Typography } from '@material-ui/core'
import Urls from '../util/Urls'
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import FullCrud, { renderType, WSResponse } from '../components/FullCrud'
import useAxios from '../util/useAxios'
import { useHistory } from 'react-router-dom'
import { FieldProps } from 'material-crud/dist/components/Form/FormTypes'

interface ListenerProps {
  id: number
  c2_id: number
  type: string
  options: { name: string; value: string }[]
}

export default () => {
  useNavigatorConfig({ title: 'Listeners', noPadding: false })
  const { setLoading } = useNavigator()
  const { location } = useHistory<any>()

  const crudRef = useRef<CrudRefProps | null>(null)
  const refFilter = useRef(true)

  const [typeSelected, setTypeSelected] = useState('')

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
  }, [loadingC2, loadingTypes, setLoading])

  const columns = useMemo(
    () =>
      createColumns([
        {
          id: 'id',
          type: TableTypes.String,
          title: 'ID',
          width: 1,
          align: 'center',
        },
        {
          id: 'type',
          type: TableTypes.String,
          title: 'Type',
          cellComponent: ({ rowData }) =>
            listenerTypes?.results.find((x) => x.id === rowData.listener_type)?.name || '-',
          width: 2,
          align: 'center',
        },
        {
          id: 'c2_id',
          type: TableTypes.String,
          title: 'C2',
          width: 1,
          align: 'center',
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
          id: 'creation_date',
          title: 'Date',
          type: TableTypes.Date,
          width: 3,
          align: 'flex-end',
        },
        {
          id: 'options',
          title: 'Options',
          type: TableTypes.Custom,
          height: 80,
          align: 'flex-end',
          cellComponent: ({ expandRow, isExpanded }) => (
            <Tooltip title="Open options">
              <IconButton size="small" onClick={expandRow}>
                {isExpanded ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
              </IconButton>
            </Tooltip>
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
          id: 'listener_type',
          type: FormTypes.Options,
          title: 'Type',
          options: listenerTypes?.results.map(({ id, name }) => ({ id, title: name })) || [],
          placeholder: 'Select one type',
          validate: Yup.number().required('Required'),
          onSelect: (val) => setTypeSelected(val as string),
          readonly: 'edit',
        },
        {
          id: 'c2_id',
          type: FormTypes.Options,
          options:
            listenerTypes?.results
              .find(({ id }) => id.toString() === typeSelected.toString())
              ?.available_c2s.map(({ c2_id, name }: any) => ({ id: c2_id, title: name })) || [],
          title: 'C2',
          placeholder: 'Select one C2',
          validate: Yup.number().required('Required'),
        },
        listenerTypes?.results
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
                depends: (props) => id === props.listener_type,
                validate:
                  required.toLowerCase() === 'true'
                    ? Yup.string().when('listener_type', {
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
    [listenerTypes, typeSelected],
  )

  return (
    <FullCrud
      ref={(e) => (crudRef.current = e)}
      columns={columns}
      fields={fields}
      filters={filters}
      description="Listener"
      name="Listener"
      itemName={'interface'}
      actions={{ edit: true, delete: true, pinToTop: true }}
      url={Urls.listeners}
      transform={(action, rowData) => {
        if (action === 'query') {
          const retorno = { ...rowData, ...rowData.filter }
          if (refFilter.current && location?.state?.c2_id) {
            retorno.c2_id = location.state.c2_id
            refFilter.current = false
          }
          return retorno
        }
        if (action === 'new' || action === 'update') {
          const options = Object.keys(rowData).reduce<any[]>((final, actual) => {
            if (rowData.listener_type.toString() !== actual.split('-')[0]) {
              return final
            }
            const item = { name: actual.split('-')[1], value: rowData[actual] }
            if (item.value) {
              return [...final, item]
            }
            return final
          }, [])
          return { ...rowData, options }
        }
        return rowData
      }}
      transformToEdit={(data) => {
        const options = data.options.reduce((final: {}, { name, value }: any) => {
          const item = { [`${data.listener_type}-${name}`]: value }
          return { ...final, ...item }
        }, {})
        return { ...data, ...options }
      }}
    />
  )
}

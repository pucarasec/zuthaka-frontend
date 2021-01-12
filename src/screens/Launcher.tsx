import React, { useEffect, useMemo, useRef } from 'react'
import {
  createFields,
  createColumns,
  TableTypes,
  FormTypes,
  CrudRefProps,
  callWs,
} from 'material-crud'
import Urls from '../util/Urls'
import { Tooltip, IconButton, Typography } from '@material-ui/core'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import FullCrud, { renderType, WSResponse } from '../components/FullCrud'
import useAxios from '../util/useAxios'
import * as Yup from 'yup'
import { FieldProps } from 'material-crud/dist/components/Form/FormTypes'
import { FaDownload } from 'react-icons/fa'

export default () => {
  useNavigatorConfig({ title: 'Launchers', noPadding: false })
  const crudRef = useRef<CrudRefProps | null>(null)
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
          align: 'center',
        },
        {
          id: 'launcher_name',
          type: TableTypes.String,
          title: 'Launcher Name',
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
        {
          id: 'creation_date',
          title: 'Date',
          type: TableTypes.Date,
          align: 'center',
        },
      ]),
    [types, listenersTypes],
  )

  const filters = useMemo(
    () =>
      createFields([
        {
          id: 'listener_id',
          title: 'Listener',
          type: FormTypes.Options,
          options:
            listenersTypes?.results.map(({ name, id }: any) => ({
              id,
              title: `${name} (${id})`,
            })) || [],
          placeholder: 'Select one listener',
        },
        {
          id: 'launcher_type',
          title: 'Launcher',
          type: FormTypes.Options,
          options:
            types?.results.map(({ name, id }: any) => ({
              id,
              title: `${name} (${id})`,
            })) || [],
          placeholder: 'Select one launcher',
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
    [listenersTypes, types],
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
            id,
            title: `${name} (${id})`,
          })),
          validate: Yup.number().required('Required'),
        },
        {
          id: 'launcher_type',
          title: 'Type',
          type: FormTypes.Options,
          placeholder: 'Select one type',
          options: types?.results?.map(({ name, id }: any) => ({ id, title: name })) || [],
          validate: Yup.number().required('Required'),
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
                depends: (props) => id === props.launcher_type,
                validate:
                  required.toLowerCase() === 'true'
                    ? Yup.string().when('launcher_type', {
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
    [listenersTypes, types],
  )

  return (
    <FullCrud
      ref={(e) => (crudRef.current = e)}
      description="Launcher"
      name="Launcher"
      url={Urls.launcher}
      columns={columns}
      fields={fields}
      filters={filters}
      extraActions={(rowData: any) => [
        <Tooltip title="Download" key={`${rowData.id}-1`}>
          <IconButton
            size="small"
            onClick={async () => {
              setLoading(true)
              const { response } = await callWs<Blob>({
                url: Urls.launcher_download(rowData.id),
                responseType: 'blob',
              })
              if (response) {
                const url = window.URL.createObjectURL(new Blob([response]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute(
                  'download',
                  `${types?.results.find((x: any) => x.id === rowData.id)?.name}.ps1`,
                )
                document.body.appendChild(link)
                link.click()
                link.remove()
              }
              setLoading(false)
            }}>
            <FaDownload />
          </IconButton>
        </Tooltip>,
      ]}
      transform={(action, rowData) => {
        if (action === 'query') {
          const retorno = { ...rowData, ...rowData.filter }
          return retorno
        }
        if (action === 'new' || action === 'update') {
          const options = Object.keys(rowData).reduce<any[]>((final, actual) => {
            if (rowData.launcher_type.toString() !== actual.split('-')[0]) {
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
          const item = { [`${data.launcher_type}-${name}`]: value }
          return { ...final, ...item }
        }, {})
        return { ...data, ...options }
      }}
    />
  )
}

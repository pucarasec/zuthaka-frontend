import React, { useEffect, useMemo, useRef } from 'react'
import { createFields, createColumns, TableTypes, FormTypes, CrudRefProps } from 'material-crud'
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
              ({ type, name, description, required }: any): FieldProps => ({
                id: `${id}-${name}`,
                type: renderType(type),
                title: name,
                help: description || '',
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
      itemId="id"
      columns={columns}
      actions={{ edit: true, delete: true, pinToTop: true }}
      fields={fields}
      transform={(action, rowData) => {
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

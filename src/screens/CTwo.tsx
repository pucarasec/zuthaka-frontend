import React, { useEffect, useMemo } from 'react'
import {
  createColumns,
  createFields,
  Crud,
  FormTypes,
  TableTypes,
  useAxios,
  useWindowSize,
} from 'material-crud'
import { IconButton, Tooltip } from '@material-ui/core'
import { FaChevronCircleDown, FaChevronCircleUp, FaEye } from 'react-icons/fa'
import Urls from '../util/Urls'
import { crudResponse, crudInteractions } from '../util/CrudConfig'
import { useNavigatorConfig } from 'material-navigator'
import { useHistory } from 'react-router-dom'
import { crudError, crudFinised } from '../util/addOns'
import { useSnackbar } from 'notistack'

export default () => {
  useNavigatorConfig({ title: 'Settings - C2' })
  const { push } = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const { call, response } = useAxios()
  const { height } = useWindowSize()

  useEffect(() => {
    call({ url: Urls.c2_types, method: 'GET' })
  }, [call])

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
          options: response?.results?.map(({ name }: any) => ({ id: name })) || [],
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
    [response],
  )

  return (
    <Crud
      description="C2 example"
      name="C2"
      url={Urls.c2}
      height={height - 200}
      columns={columns}
      fields={fields}
      actions={{ edit: true, delete: true }}
      extraActions={(rowData) => {
        return [
          <Tooltip title="Go to listeners" key={rowData.id}>
            <IconButton onClick={() => push('/listener', { c2_id: rowData.id })}>
              <FaEye />
            </IconButton>
          </Tooltip>,
        ]
      }}
      // rightToolbar={({}) => {
      // 	return (
      // 		<IconButton size="small">
      // 			<FaCheck />
      // 		</IconButton>
      // 	)
      // }}
      onError={crudError(enqueueSnackbar)}
      onFinished={crudFinised(enqueueSnackbar, 'C2')}
      itemId="id"
      itemName="type"
      idInUrl
      response={crudResponse}
      interaction={crudInteractions}
      // transformToEdit={(rowData) => ({ ...rowData, type: rowData.type })}
    />
  )
}

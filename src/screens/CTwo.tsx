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
import { IconButton } from '@material-ui/core'
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa'
import { useSnackbar } from 'notistack'
import Urls from '../util/Urls'

export default () => {
  const { call, response } = useAxios()
  const { height } = useWindowSize()
  const { enqueueSnackbar } = useSnackbar()

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
          height: 50,
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
                  <p key={name}>{`${name} (${value})`}</p>
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
          options: response?.results?.map(({ name, id }: any) => ({ id: name, title: name })) || [],
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
      // rightToolbar={({}) => {
      // 	return (
      // 		<IconButton size="small">
      // 			<FaCheck />
      // 		</IconButton>
      // 	)
      // }}
      onError={(err) => enqueueSnackbar(`An error ocurred`, { variant: 'error' })}
      onFinished={(e) => {
        const message = `c2 ${
          e === 'delete' ? 'deleted' : e === 'new' ? 'added' : 'edited'
        } successfully`
        enqueueSnackbar(message, { variant: 'success' })
      }}
      itemId="id"
      itemName="type"
      idInUrl
      response={{
        list: (cList) => ({
          items: cList.results,
          page: 1,
          limit: -1,
          totalDocs: cList.count,
        }),
        new: (data, response) => response,
        edit: (data, response) => response,
      }}
    />
  )
}

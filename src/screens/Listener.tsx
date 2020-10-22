import React, { useEffect, useMemo } from 'react'
import { createFields, Crud, Types, useAxios, useWindowSize } from 'material-crud'
import { IconButton } from '@material-ui/core'
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa'

export default () => {
  const { call, response } = useAxios()
  const { height } = useWindowSize()

  useEffect(() => {
    call({ url: 'http://127.0.0.1:8000/listeners/types/', method: 'GET' })
    call({ url: 'http://127.0.0.1:8000/c2/', method: 'GET' })
  }, [call])

  const fields = useMemo(
    () =>
      createFields(() => [
        // {
        // 	id: 'c2_id_query',
        // 	type: Types.Options,
        // 	options: response?.results?.map(({ name, id }: any) => ({ id: name, title: name })),
        // 	title: 'C2',
        // 	placeholder: 'Select one C2',
        // 	// list: {
        // 	// 	width: 1,
        // 	// 	cellComponent: ({ expandRow, isExpanded }) => <IconButton onClick={expandRow}>{isExpanded ? <FaChevronCircleUp /> : <FaChevronCircleDown />}</IconButton>,
        // 	// 	content: (rowData) =>
        // 	// 		!rowData?.options.length
        // 	// 			? 'No rows'
        // 	// 			: rowData?.options.map(({ name, value }: any) => (
        // 	// 					<p key={name}>
        // 	// 						{name} ({value})
        // 	// 					</p>
        // 	// 			  )),
        // 	// },
        // },
        {
          id: 'type',
          type: Types.Options,
          options: response?.results?.map(({ name, id }: any) => ({ id: name, title: name })),
          title: 'Type',
          placeholder: 'Select one type',
          list: {
            width: 1,
            cellComponent: ({ expandRow, isExpanded }) => (
              <IconButton onClick={expandRow}>
                {isExpanded ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
              </IconButton>
            ),
            content: (rowData) =>
              !rowData?.options.length
                ? 'No rows'
                : rowData?.options.map(({ name, value }: any) => (
                    <p key={name}>
                      {name} ({value})
                    </p>
                  )),
          },
        },
        {
          id: 'options',
          title: 'Options',
          type: Types.Multiple,
          configuration: [
            { id: 'name', type: Types.Input, title: 'Name' },
            { id: 'value', type: Types.Input, title: 'Value' },
          ],
        },
        {
          id: 'creation_date',
          type: Types.Input,
          edit: false,
          title: 'Date',
          list: { width: 4 },
        },
      ]),
    [response],
  )

  return (
    <Crud
      height={height}
      columns={fields}
      description="Listener"
      name="Listener"
      url="http://127.0.0.1:8000/listeners/"
      actions={{
        new: true,
        edit: true,
        delete: true,
      }}
      itemId="id"
      idInUrl
      response={{
        list: (cList) => ({
          items: cList.results,
          page: 1,
          limit: -1,
          totalDocs: cList.count,
        }),
        new: (data, response) => ({ ...data, id: response[0].id }),
        edit: (data, response) => data,
      }}
    />
  )
}

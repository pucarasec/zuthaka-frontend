import React, { useEffect, useMemo } from 'react'
import { createFields, Crud, Types, useAxios, useWindowSize } from 'material-crud'
import { IconButton } from '@material-ui/core'
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa'

interface ListenerProps {
	project_id_query: string
	c2_id_query: string
	type: string
	options: { name: string; value: string }[]
}

export default () => {
	const { call, response } = useAxios()
	const { height } = useWindowSize()

	useEffect(() => {
		call({ url: 'http://127.0.0.1:8000/listeners/types/', method: 'GET' })
	}, [call])

	const fields = useMemo(
		() =>
			createFields(() => [
				{
					id: 'options',
					type: Types.Autocomplete,
					onChangeText: (value) => value,
					multiple: true,
					options: [
						{ id: '1', title: 'HTTP' },
						{ id: '2', title: 'HTTPS' },
					],
					title: 'Options',
					placeholder: 'Select one type',
					list: {
						width: 1,
						cellComponent: ({ expandRow, isExpanded }) => <IconButton onClick={expandRow}>{isExpanded ? <FaChevronCircleUp /> : <FaChevronCircleDown />}</IconButton>,
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
					id: 'type',
					type: Types.Options,
					options: [
						{ id: '1', title: 'Empire' },
						{ id: '2', title: 'OTRO' },
					],
					title: 'Type',
					placeholder: 'Select one C2',
					list: { width: 3 },
				},
				{
					id: 'creation_date',
					type: Types.Input,
					edit: false,
					title: 'Date',
					list: { width: 4 },
				},				
			]),
		[response]
	)

	return (
		<Crud
			height={height}
			columns={fields}
			description="Listener"
			name="Listener"
			url="http://127.0.0.1:8000/listeners/"
			edit
			deleteRow
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

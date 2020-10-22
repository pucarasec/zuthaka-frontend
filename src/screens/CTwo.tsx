import React, { useEffect, useMemo } from 'react'
import { createFields, Crud, Types, useAxios, useWindowSize } from 'material-crud'
import { IconButton } from '@material-ui/core'
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa'
import { useSnackbar } from 'notistack'

export default () => {
	const { call, response } = useAxios()
	const { height } = useWindowSize()
	const { enqueueSnackbar } = useSnackbar()

	useEffect(() => {
		call({ url: 'http://127.0.0.1:8000/c2/types/', method: 'GET' })
	}, [call])

	const fields = useMemo(
		() =>
			createFields(() => [
				{
					id: 'expand',
					title: 'Options',
					type: Types.Input,
					edit: false,
					list: {
						width: 5,
						cellComponent: ({ expandRow, isExpanded }) => {
							return <IconButton onClick={expandRow}>{isExpanded ? <FaChevronCircleUp /> : <FaChevronCircleDown />}</IconButton>
						},
						content: (rowData) =>
							!rowData?.options.length ? 'Without options' : rowData?.options.map(({ name, value }: any) => <p key={name}>{`${name} (${value})`}</p>),
					},
				},
				[
					{
						id: 'type',
						title: 'Type',
						type: Types.Options,
						placeholder: 'Select one type',
						options: response?.results?.map(({ name, id }: any) => ({ id: name, title: name })),
						list: { width: 15 },
					},
					{ id: 'creation_date', title: 'Date', type: Types.Input, list: { width: 25 }, edit: false },
				],
				{
					id: 'options',
					title: 'Options',
					type: Types.Multiple,
					configuration: [
						{ id: 'name', type: Types.Input, title: 'Name' },
						{ id: 'value', type: Types.Input, title: 'Value' },
					],
				},
			]),
		[response]
	)

	return (
		<Crud
			description="C2 example"
			name="C2"
			url="http://127.0.0.1:8000/c2/"
			height={height - 100}
			columns={fields}
			edit
			deleteRow
			// rightToolbar={({}) => {
			// 	return (
			// 		<IconButton size="small">
			// 			<FaCheck />
			// 		</IconButton>
			// 	)
			// }}
			onError={(err) => enqueueSnackbar(`An error ocurred`, { variant: 'error' })}
			onFinished={(e) => {
				const message = `c2 ${e === 'delete' ? 'deleted' : e === 'new' ? 'added' : 'edited'} successfully`
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

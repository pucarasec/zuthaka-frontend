import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import TableExample from '../components/TableExample'
import { Dialog, CenteredCard, Form, Crud, Types } from 'material-crud'
import { english } from '../util/lang'

interface LauncherProps {
	id: string
	cTwo: string
	listener: string
	type: string
	creationDate: string
	actions: string
}

const Item = ({ id, cTwo, listener, type, creationDate, actions }: LauncherProps) => {
	return (
		<div style={{ flex: 1 }}>
			<div>
				<span>ID: {id}</span>
				<span>C2: {cTwo}</span>
				<span>Listener: {listener}</span>
			</div>
		</div>
	)
}

export default () => {
	return (
		<Crud
			renderItem={props => <Item {...props} />}
			name="Launcher"
			description="Launcher"
			lang={english}
			fields={[
				{
					id: 'c2_id_query',
					type: Types.Options,
					options: [
						{ id: '1', title: 'Empire' },
						{ id: '2', title: 'OTRO' },
						{ id: '3', title: 'TERCERO' }
					],
					title: 'C2',
					placeholder: 'Select one C2'
				},
				{
					id: 'type',
					type: Types.Options,
					options: [
						{ id: '1', title: 'HTTP' },
						{ id: '2', title: 'HTTPS' }
					],
					title: 'Types',
					placeholder: 'Select one type'
				}
			]}
		/>
		// <CenteredCard title="TITULO" Right={<span>RIGHT</span>}>
		// 	<Form
		// 		fields={[
		// 			{
		// 				id: 'c2_id_query',
		// 				type: Types.Options,
		// 				options: [
		// 					{ id: '1', title: 'Empire' },
		// 					{ id: '2', title: 'OTRO' },
		// 					{ id: '3', title: 'TERCERO' }
		// 				],
		// 				title: 'C2',
		// 				placeholder: 'Select one C2'
		// 			},
		// 			{
		// 				id: 'type',
		// 				type: Types.Options,
		// 				options: [
		// 					{ id: '1', title: 'HTTP' },
		// 					{ id: '2', title: 'HTTPS' }
		// 				],
		// 				title: 'Types',
		// 				placeholder: 'Select one type'
		// 			}
		// 		]}
		// 		accept="SIGUIENTE"
		// 		onSubmit={vals => console.log(vals)}
		// 	/>
		// </CenteredCard>
	)
}

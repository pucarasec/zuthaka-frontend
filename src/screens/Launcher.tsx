import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import TableExample from '../components/TableExample'
import { Dialog, CenteredCard, Form, Crud, Types } from 'material-crud'

interface LauncherProps {
	id: string
	cDos: string
	listener: string
	type: string
	creationDate: string
	actions: string
}

const Item = ({ id, cDos, listener, type, creationDate, actions }: LauncherProps) => {
	return (
		<div style={{ flex: 1 }}>
			<div>
				<span>ID: {id}</span>
				<span>C2: {cDos}</span>
				<span>Listener: {listener}</span>
			</div>
		</div>
	)
}

export default () => {
	return (
		<CenteredCard title="TITULO" Right={<span>RIGHT</span>}>
			<Form
				fields={[
					{
						id: 'c2_id_query',
						type: Types.Options,
						options: [
							{ id: '1', title: 'Empire' },
							{ id: '2', title: 'OTRO' }
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
				accept="SIGUIENTE"
				onSubmit={vals => console.log(vals)}
			/>
		</CenteredCard>
		// <TableExample
		// 	boton="Create Launcher"
		// 	th={['ID', 'C2', 'Listener', 'Type', 'Creation Date', 'Actions']}
		// 	td={['1', 'Empire', 'Pepito', 'windows/powershell', 'ISO DATE', 'BOTONES']}
		// />
	)
}

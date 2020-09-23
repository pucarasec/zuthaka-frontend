import React from 'react'
import TableExample from '../components/TableExample'
import { Crud, Types } from 'material-crud'
import { english } from '../util/lang'

interface ListenerProps {
	project_id_query: string
	c2_id_query: string
	type: string
	options: { name: string; value: string }[]
}

export default () => {
	return (
		<Crud
			lang={english}
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
			description="Listener"
			name="Listener"
			renderItem={item => <span>ASD</span>}
		/>
	)
}

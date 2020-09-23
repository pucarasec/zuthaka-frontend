import React from 'react'
import { Crud, Types } from 'material-crud'
import ItemCTwo from '../components/list/ItemCTwo'
import { CTwoProps } from '../components/list/ItemCTwo'
import { english } from '../util/lang'

export default () => {
	return (
		<Crud
			lang={english}
			fields={[
				{ id: 'equipo', type: Types.Input, title: 'Equipo' },
				[
					{ id: 'jugador', type: Types.Input, title: 'Jugador', grow: 6 },
					{ id: 'numero', type: Types.Number, title: 'Numero', grow: 4 }
				]
			]}
			description="C2 example"
			name="C2"
			// url="http://localhost:5050/api/camiseta"
			renderItem={(props: CTwoProps) => <ItemCTwo {...props} />}
			onError={err => console.log(err)}
			onFinished={e => console.log(e)}
		/>
	)
}

import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
	table: {
		borderCollapse: 'collapse',
		width: '100%'
	},
	fila: {
		border: '1px solid #dddddd',
		textAlign: 'left',
		padding: 8
	}
})

interface Props {
	th: string[]
	td: string[]
	boton: string
}

export default ({ th, td, boton }: Props) => {
	const classes = useStyles()

	return (
		<div>
			<Button variant="contained" color="primary" style={{ margin: 8 }}>
				{boton}
			</Button>
			<table className={classes.table}>
				<thead>
					<tr className={classes.fila}>
						{th.map(x => (
							<th key={x}>{x}</th>
						))}
					</tr>
				</thead>
				<tbody>
					<tr className={classes.fila}>
						{td.map(x => (
							<td key={x}>{x}</td>
						))}
					</tr>
				</tbody>
			</table>
		</div>
	)
}

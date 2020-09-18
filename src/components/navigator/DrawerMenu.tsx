import React, { ReactNode, memo } from 'react'
import { Drawer, IconButton, Divider, List, ListItem, ListItemText, makeStyles } from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom'
import { FaChevronLeft } from 'react-icons/fa'

export interface RoutesProps {
	route: string
	name: string
	component: ReactNode
	show?: boolean
	exact?: boolean
}

interface Props {
	show: boolean
	onClose: () => void
	routes: RoutesProps[]
}

export default memo(({ show, onClose, routes }: Props) => {
	const classes = useClasses()
	const history = useHistory()
	const location = useLocation()

	return (
		<Drawer className={classes.menu} variant="persistent" anchor="left" open={show} classes={{ paper: classes.pelpa }}>
			<div className={classes.cabecera}>
				<IconButton onClick={onClose}>
					<FaChevronLeft />
				</IconButton>
			</div>
			<Divider />
			<List>
				{routes
					.filter(e => e.show)
					.map(({ name, route }) => (
						<ListItem
							button
							selected={location.pathname === route}
							key={route}
							onClick={() => {
								history.push(route)
								onClose()
							}}
						>
							<ListItemText primary={name} />
						</ListItem>
					))}
			</List>
		</Drawer>
	)
})

export const menuWidth = 240
const useClasses = makeStyles(theme => ({
	menu: {
		width: menuWidth,
		flexShrink: 0
	},
	pelpa: {
		width: menuWidth
	},
	cabecera: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		justifyContent: 'flex-start',
		...theme.mixins.toolbar
	}
}))

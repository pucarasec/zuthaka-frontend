import React, { useState, ReactNode, memo, Suspense, lazy } from 'react'
import { CssBaseline, makeStyles, CircularProgress, LinearProgress } from '@material-ui/core'
import { menuWidth, RoutesProps } from './DrawerMenu'
import { useLocation } from 'react-router-dom'

const DrawerMenu = lazy(() => import('./DrawerMenu'))
const Header = lazy(() => import('./Header'))

interface Props {
	children: ReactNode
	routes: RoutesProps[]
}

export const createRoutes = (props: () => RoutesProps[]) => props()

export default memo(({ children, routes }: Props) => {
	const { pathname } = useLocation()
	const classes = useClasses({ pathname })
	const [menu, setMenu] = useState(false)

	return (
		<div className={classes.container}>
			<CssBaseline />
			<Suspense fallback={<LinearProgress />}>
				<Header routes={routes} menu={menu} onMenu={() => setMenu(e => !e)} />
				<DrawerMenu routes={routes} show={menu} onClose={() => setMenu(e => !e)} />
			</Suspense>
			<main className={`${classes.contenido} ${menu && classes.contenidoOpen}`}>
				<div className={classes.cabecera} />
				<Suspense fallback={<CircularProgress />}>{children}</Suspense>
			</main>
		</div>
	)
})

const useClasses = makeStyles(tema => ({
	container: {
		display: 'flex'
	},
	contenido: {
		flexGrow: 1,
		transition: tema.transitions.create('margin', {
			easing: tema.transitions.easing.sharp,
			duration: tema.transitions.duration.leavingScreen
		}),
		padding: tema.spacing(3),
		marginLeft: -menuWidth
	},
	contenidoOpen: {
		transition: tema.transitions.create('margin', {
			easing: tema.transitions.easing.easeOut,
			duration: tema.transitions.duration.enteringScreen
		}),
		marginLeft: 0
	},
	cabecera: {
		display: 'flex',
		alignItems: 'center',
		padding: tema.spacing(0, 1),
		...tema.mixins.toolbar,
		justifyContent: 'flex-start'
	}
}))

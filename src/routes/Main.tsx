import React, { Suspense } from 'react'
import { CircularProgress } from '@material-ui/core'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Container, { createRoutes } from '../components/navigator/Container'
import Home from '../screens/Home'
import Launcher from '../screens/Launcher'
import Listener from '../screens/Listener'
import CTwo from '../screens/CTwo'

export default () => {
	const routes = createRoutes(() => [
		{ route: '/', name: 'Dashboard', component: <Home />, show: true },
		{ route: '/ctwo', name: 'Settings', component: <CTwo />, show: true },
		{ route: '/launcher', name: 'Launcher', component: <Launcher />, show: true },
		{ route: '/listener', name: 'Listener', component: <Listener />, show: true }
	])

	return (
		<BrowserRouter>
			<Container routes={routes}>
				<Switch>
					<Suspense fallback={<CircularProgress />}>
						{routes.map(({ route, component, exact }) => (
							<Route key={route} path={route} exact={exact || route === '/'}>
								{component}
							</Route>
						))}
					</Suspense>
				</Switch>
			</Container>
		</BrowserRouter>
	)
}

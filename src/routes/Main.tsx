import React from 'react'
import { createMenu, createRoutes, createUserMenu, Navigator } from 'material-navigator'
import Home from '../screens/Home'
import Launcher from '../screens/Launcher'
import Listener from '../screens/Listener'
import CTwo from '../screens/CTwo'
import {
  FaMoon,
  FaPhoneSquareAlt,
  FaPlaneDeparture,
  FaSignOutAlt,
  FaSun,
  FaThLarge,
  FaTools,
  FaUserSecret,
} from 'react-icons/fa'
import { useColorTheme } from '../util/Theme'
import Agents from '../screens/Agents'
import DetailAgent from '../screens/agents/DetailAgent'
import { SocketProvider } from '../util/SocketContext'
import Urls from '../util/Urls'

export default () => {
  const { setColor, color } = useColorTheme()

  const routes = createRoutes([
    { route: '/', component: <Home /> },
    { route: '/ctwo', component: <CTwo /> },
    { route: '/listener', component: <Listener /> },
    { route: '/launcher', component: <Launcher /> },
    { route: '/agents', component: <Agents /> },
    { route: '/detail_agent', component: <DetailAgent detached={false} /> },
    { route: '/detached_agent', component: <DetailAgent detached /> },
  ])

  const menu = createMenu([
    { title: 'Dashboard', icon: <FaThLarge />, route: '/' },
    { title: 'C2', icon: <FaTools />, route: '/ctwo' },
    { title: 'Listener', icon: <FaPhoneSquareAlt />, route: '/listener' },
    { title: 'Launcher', icon: <FaPlaneDeparture />, route: '/launcher' },
    { title: 'Agents', icon: <FaUserSecret />, route: '/agents' },
  ])

  const userMenu = createUserMenu([
    {
      id: 'logout',
      title: 'Log out',
      icon: <FaSignOutAlt />,
      onClick: () => console.log('LOGOUT'),
    },
  ])

  return (
    <SocketProvider url={Urls.socket}>
      <Navigator
        maintainIcons
        menu={menu}
        routes={routes}
        config={{ title: 'Zuthaka', showUser: true }}
        userMenu={userMenu}
        extraIcons={[
          {
            id: 'sun',
            icon: color === 'dark' ? <FaSun /> : <FaMoon />,
            tooltip: 'Change dark/light theme',
            onClick: () => {
              setColor((color) => (color === 'dark' ? 'light' : 'dark'))
            },
          },
        ]}
      />
    </SocketProvider>
  )
}

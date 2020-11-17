import React, { useCallback } from 'react'
import { createMenu, createRoutes, createUserMenu, Navigator } from 'material-navigator'
import Home from '../screens/Home'
import Launcher from '../screens/Launcher'
import Listener from '../screens/Listener'
import CTwo from '../screens/CTwo'
import { FaMoon, FaSignOutAlt, FaSun } from 'react-icons/fa'
import { useColorTheme } from '../util/Theme'

export default () => {
  const { setColor, color } = useColorTheme()

  const routes = createRoutes([
    { route: '/', component: <Home /> },
    { route: '/ctwo', component: <CTwo /> },
    { route: '/listener', component: <Listener /> },
    { route: '/launcher', component: <Launcher /> },
  ])

  const menu = createMenu([
    { title: 'Dashboard', route: '/' },
    { title: 'C2', route: '/ctwo' },
    { title: 'Listener', route: '/listener' },
    { title: 'Launcher', route: '/launcher' },
  ])

  const userMenu = createUserMenu([
    {
      id: 'logout',
      title: 'Log out',
      icon: <FaSignOutAlt />,
      onClick: () => console.log('LOGOUT'),
    },
  ])

  // const changeTheme = () => setColor(color === 'dark' ? 'light' : 'dark')

  return (
    <Navigator
      menu={menu}
      routes={routes}
      config={{ title: 'Suthaka', showUser: true }}
      userMenu={userMenu}
      extraIcons={[
        {
          id: 'sun',
          icon: color === 'dark' ? <FaSun /> : <FaMoon />,
          tooltip: 'Change dark/light theme',
          onClick: () => setColor(color === 'dark' ? 'light' : 'dark'),
        },
      ]}
    />
  )
}

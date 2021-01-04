import React from 'react'
import { createMenu, createRoutes, createUserMenu, Navigator } from 'material-navigator'
import Storage from '../util/Storage'
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
import { useUser } from 'material-crud'
import Login from '../screens/Login'

export default () => {
  const { setColor, color } = useColorTheme()
  const { user, setUser } = useUser()

  const routes = createRoutes([
    { route: '/login', component: <Login /> },
    { route: '/', component: <Home />, hidden: !user },
    { route: '/ctwo', component: <CTwo />, hidden: !user },
    { route: '/listener', component: <Listener />, hidden: !user },
    { route: '/launcher', component: <Launcher />, hidden: !user },
    { route: '/agents', component: <Agents />, hidden: !user },
    { route: '/detail_agent', component: <DetailAgent detached={false} />, hidden: !user },
    { route: '/detached_agent', component: <DetailAgent detached />, hidden: !user },
  ])

  const menu = createMenu([
    { title: 'Dashboard', icon: <FaThLarge />, route: '/', hidden: !user },
    { title: 'C2', icon: <FaTools />, route: '/ctwo', hidden: !user },
    { title: 'Listener', icon: <FaPhoneSquareAlt />, route: '/listener', hidden: !user },
    { title: 'Launcher', icon: <FaPlaneDeparture />, route: '/launcher', hidden: !user },
    { title: 'Agents', icon: <FaUserSecret />, route: '/agents', hidden: !user },
  ])

  const userMenu = createUserMenu([
    {
      id: 'logout',
      title: 'Sign out',
      icon: <FaSignOutAlt />,
      onClick: (history) => {
        setUser(null)
        Storage.removeItem('User')
        history.replace('/login')
      },
    },
  ])

  return (
    <Navigator
      maintainIcons
      menu={menu}
      routes={routes}
      config={{ title: 'Zuthaka', showUser: !!user }}
      userMenu={userMenu}
      loginPath="/login"
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
  )
}

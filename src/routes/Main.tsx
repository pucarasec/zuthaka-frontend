import React, { useMemo } from 'react'
import { createMenu, createRoutes, createUserMenu, Navigator } from 'material-navigator'
import Storage from '../util/Storage'
import Home from '../screens/Home'
import Launcher from '../screens/Launcher'
import Listener from '../screens/Listener'
import CTwo from '../screens/CTwo'
import {
  FaCode,
  FaMoon,
  FaPhoneSquareAlt,
  FaPlaneDeparture,
  FaSignOutAlt,
  FaSun,
  FaThLarge,
  FaTools,
  FaUserLock,
  FaUserSecret,
} from 'react-icons/fa'
import { useColorTheme } from '../util/Theme'
import Agents from '../screens/Agents'
import { useUser } from 'material-crud'
import Login from '../screens/Login'
import DetailWrapper from '../components/DetailWrapper'
import ChangePassword from '../screens/ChangePassword'
import { useLogging } from '../util/LoggingContext'
import { ReactComponent as Logo } from '../assets/images/logo.svg'
import LogoExtendido from '../assets/images/logoExtendido.png'
import { makeStyles } from '@material-ui/core'

export default () => {
  const { setColor, color } = useColorTheme()
  const { user, setUser } = useUser()
  const { logging, setLogging } = useLogging()
  const classes = useClasses()

  const routes = createRoutes([
    { route: '/login', component: <Login /> },
    { route: '/', component: <Home />, hidden: !user },
    { route: '/ctwo', component: <CTwo />, hidden: !user },
    { route: '/listener', component: <Listener />, hidden: !user },
    { route: '/launcher', component: <Launcher />, hidden: !user },
    { route: '/agents', component: <Agents />, hidden: !user },
    { route: '/detail_agent', component: <DetailWrapper detached={false} />, hidden: !user },
    { route: '/detached_agent', component: <DetailWrapper detached />, hidden: !user },
    { route: '/changePass', component: <ChangePassword />, hidden: !user },
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
      id: 'changePass',
      title: 'Change password',
      icon: <FaUserLock />,
      onClick: (history) => {
        history.replace('/changePass')
      },
    },
    {},
    {
      id: 'logout',
      title: 'Sign out',
      icon: <FaSignOutAlt />,
      onClick: (history) => {
        setUser(null)
        Storage.removeAll()
        history.replace('/login')
      },
    },
  ])

  return (
    <Navigator
      maintainIcons
      menu={menu}
      routes={routes}
      menuDrawerIcon={<Logo height={35} />}
      config={{ title: 'Zuthaka', showUser: !!user }}
      userMenu={userMenu}
      menuDrawerHeader={
        <img src={LogoExtendido} alt="logo extendido" height={35} className={classes.logo} />
      }
      extraIcons={[
        {
          id: 'sun',
          icon: color === 'dark' ? <FaSun /> : <FaMoon />,
          tooltip: 'Change dark/light theme',
          onClick: () => {
            setColor((color) => (color === 'dark' ? 'light' : 'dark'))
          },
        },
        {
          id: 'logging',
          icon: <FaCode />,
          tooltip: `${!logging ? 'Activate' : 'Desactivate'} logging`,
          onClick: () => setLogging(!logging),
        },
      ]}
    />
  )
}

const useClasses = makeStyles((theme) => ({
  logo: {
    marginLeft: theme.spacing(2),
  },
}))

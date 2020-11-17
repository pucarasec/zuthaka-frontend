import React, { memo } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  makeStyles,
  Button,
  Switch,
} from '@material-ui/core'
import { menuWidth, RoutesProps } from './DrawerMenu'
import { FaBars, FaMoon, FaSun, FaUser } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import { useColorTheme } from '../../util/Theme'

interface Props {
  menu: boolean
  onMenu: () => void
  routes: RoutesProps[]
}

export default memo(({ menu, onMenu, routes }: Props) => {
  const { setColor, color } = useColorTheme()
  const classes = useClasses({ menu })
  const { pathname } = useLocation()
  const actual = routes.find((e) => e.route === pathname)

  return (
    <AppBar position="fixed" className={`${classes.container} ${menu && classes.containerOpen}`}>
      <Toolbar>
        <IconButton edge="start" className={classes.menuBoton} color="inherit" onClick={onMenu}>
          <FaBars />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {`${actual?.name || 'Sukhata'}`}
        </Typography>
        <Switch
          checkedIcon={<FaSun color="white" size={20} />}
          icon={<FaMoon color="white" size={20} />}
          color="default"
          checked={color === 'light'}
          style={{ height: 30 }}
          onChange={() => setColor(color === 'dark' ? 'light' : 'dark')}
        />
        {/* <Button
          onClick={() => {
            setColor(color === 'dark' ? 'light' : 'dark')
          }}
          color="inherit"
          startIcon={<FaUser />}>
          {`${color === 'dark' ? 'Light' : 'Dark'} Mode`}
        </Button> */}
        <Button onClick={() => {}} color="inherit" startIcon={<FaUser />}>
          User
        </Button>
      </Toolbar>
    </AppBar>
  )
})

const useClasses = makeStyles((theme) => ({
  container: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  containerOpen: {
    width: `calc(100% - ${menuWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: menuWidth,
  },
  menuBoton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  detalleUsuario: {
    padding: theme.spacing(1),
  },
}))

import React, { memo } from 'react'
import { AppBar, Toolbar, IconButton, Typography, makeStyles } from '@material-ui/core'
import { menuWidth, RoutesProps } from './DrawerMenu'
import { FaBars, FaUser } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'

interface Props {
  menu: boolean
  onMenu: () => void
  routes: RoutesProps[]
}

export default memo(({ menu, onMenu, routes }: Props) => {
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
        <IconButton edge="end" color="inherit" onClick={() => console.log('logout')}>
          <FaUser />
          User
        </IconButton>
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

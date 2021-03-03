import React, { ReactNode } from 'react'
import {
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  MenuProps,
} from '@material-ui/core'

export type MenuIconOptionsProps = { icon: ReactNode; title: string; onSelect: () => void }
type MenuIconProps = MenuProps & { options: MenuIconOptionsProps[] } & { callCloseMenu: () => void }

const MenuIcon = ({ options, callCloseMenu, ...props }: MenuIconProps) => {
  const classes = useClasses()

  return (
    <div className={classes.paper}>
      <Menu anchorReference="anchorPosition" {...props}>
        {options.map(({ icon, title, onSelect }) => (
          <MenuItem
            key={title}
            onClick={() => {
              onSelect()
              callCloseMenu()
            }}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={title} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

const useClasses = makeStyles(() => ({
  paper: {
    border: '1px solid #d3d4d5',
  },
}))

export default MenuIcon

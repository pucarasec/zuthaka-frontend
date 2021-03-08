import React, { forwardRef, ReactNode } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  makeStyles,
  Slide,
  Typography,
} from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'
import { FaTimes } from 'react-icons/fa'

type Color = 'default' | 'inherit' | 'primary' | 'secondary'

interface DialogProps {
  title?: string
  children: ReactNode
  actions?: { title: string; onClick: () => void; color?: Color }[]
  open: boolean
  setOpen: (open: boolean) => void
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const ZDialog = ({ title, children, actions, open, setOpen }: DialogProps) => {
  const classes = useClasses()

  return (
    <Dialog TransitionComponent={Transition} onClose={() => setOpen(false)} open={open}>
      {title && (
        <DialogTitle>
          <Typography variant="h6">{title}</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => setOpen(false)}>
            <FaTimes />
          </IconButton>
        </DialogTitle>
      )}
      {children}
      {actions && (
        <DialogActions>
          {actions.map(({ color, onClick, title }) => (
            <Button key={title} onClick={onClick} color={color || 'default'}>
              {title}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  )
}

const useClasses = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))

export default ZDialog

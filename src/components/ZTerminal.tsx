import { IconButton, makeStyles } from '@material-ui/core'
import { useNavigator } from 'material-navigator'
import React from 'react'
import { FaWindowMinimize, FaWindowRestore, FaWindowMaximize } from 'react-icons/fa'
import Terminal from 'terminal-in-react'
import { useSocket } from '../util/SocketContext'
import { DetailWrapperProps } from './DetailWrapper'

export type TerminalSize = 'minimizezd' | 'normal' | 'maximized'

interface Props extends DetailWrapperProps {
  terminalSize: TerminalSize
  onTerminalResize: (newSize: TerminalSize) => void
}

export default ({ terminalSize, onTerminalResize, hostname }: Props) => {
  const { send, onMessage, onError } = useSocket()

  const { setLoading } = useNavigator()
  const classes = useClasses({ terminalSize })

  return (
    <div className={classes.terminal}>
      <Terminal
        style={{ fontWeight: 'bold', fontSize: '1em' }}
        color="white"
        prompt="white"
        backgroundColor="black"
        barColor="black"
        startState="maximised"
        allowTabs={false}
        hideTopBar
        msg={hostname}
        commandPassThrough={(cmd, print: (message: string) => void) => {
          const [command] = cmd
          onMessage((e) => {
            const { type, reference, content } = JSON.parse(e.data || '{}')
            if (type === 'task.created') {
              send({ type: 'shell.execute', command, reference })
            } else if (content) {
              setLoading(false)
              print(content)
            }
          })
          onError((e) => {
            setLoading(false)
            print('Command not found')
          })
          setLoading(true)
          send({ type: 'create.task' })
        }}
      />
      <div className={classes.terminalBtns}>
        <IconButton
          disabled={terminalSize === 'minimizezd'}
          size="small"
          onClick={() => onTerminalResize('minimizezd')}>
          <FaWindowMinimize />
        </IconButton>
        <IconButton
          disabled={terminalSize === 'normal'}
          size="small"
          onClick={() => onTerminalResize('normal')}>
          <FaWindowRestore />
        </IconButton>
        <IconButton
          disabled={terminalSize === 'maximized'}
          size="small"
          onClick={() => onTerminalResize('maximized')}>
          <FaWindowMaximize />
        </IconButton>
      </div>
    </div>
  )
}

const useClasses = makeStyles((theme) => ({
  terminal: ({ terminalSize }: any) => ({
    transition: theme.transitions.create('height', {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.sharp,
    }),
    height: terminalSize === 'normal' ? 175 : terminalSize === 'maximized' ? '100%' : 24,
    position: 'relative',
  }),
  terminalBtns: {
    backgroundColor: 'white',
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    position: 'absolute',
    top: 0,
    right: 0,
  },
}))

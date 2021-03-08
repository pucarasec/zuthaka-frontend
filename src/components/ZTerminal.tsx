import React from 'react'
import { IconButton, makeStyles } from '@material-ui/core'
import { FaWindowMinimize, FaWindowRestore, FaWindowMaximize } from 'react-icons/fa'
import Terminal from 'terminal-in-react'
import { useSocket } from '../util/SocketContext'
import { useColorTheme } from '../util/Theme'
import { DetailWrapperProps } from './DetailWrapper'

export type TerminalSize = 'minimizezd' | 'normal' | 'maximized'

interface Props extends DetailWrapperProps {
  terminalSize: TerminalSize
  onTerminalResize: (newSize: TerminalSize) => void
}

export default ({ terminalSize, onTerminalResize, hostname }: Props) => {
  const { isDarkTheme } = useColorTheme()
  const classes = useClasses({ terminalSize, isDarkTheme })

  const { send, onMessage, onError } = useSocket()

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
            const { type, reference, content, error } = JSON.parse(e.data || '{}')
            if (type === 'task.created') {
              send({ type: 'shell.execute', command, reference })
            } else if (content) {
              print(content)
            } else if (error) {
              print(error)
            }
          })
          onError((e) => {
            print('Command not found')
          })
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
  terminalBtns: ({ isDarkTheme }: any) => ({
    backgroundColor: isDarkTheme ? 'black' : 'white',
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    position: 'absolute',
    top: 0,
    right: 0,
  }),
}))

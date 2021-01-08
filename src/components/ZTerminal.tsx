import { IconButton, makeStyles } from '@material-ui/core'
import { useNavigator } from 'material-navigator'
import React, { useRef } from 'react'
import { FaWindowMinimize, FaWindowRestore, FaWindowMaximize } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'
import Terminal from 'terminal-in-react'
import { AgentProps } from '../screens/agents/DetailAgent'
import { useSocket } from '../util/SocketContext'

export type TerminalSize = 'minimizezd' | 'normal' | 'maximized'

interface Props {
  terminalSize: TerminalSize
  onTerminalResize: (newSize: TerminalSize) => void
}

const createTask = () => {
  return '00asda-a511asd5-asda'
}

const socket = io('http://192.168.102.50:8000/', {
  path: '/agents/1/interact/',
  transports: ['websocket'],
  reconnection: false,
})
console.log(socket.connected)

export default ({ terminalSize, onTerminalResize }: Props) => {
  //   const socket = useSocket()

  const { setLoading } = useNavigator()
  const { state } = useLocation<AgentProps>()
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
        msg={state?.hostname}
        commandPassThrough={(cmd, print: (message: string) => void) => {
          const [command] = cmd
          //   socketRef.current.send(command)
          //   socketRef.current.on(command, (data: any) => {
          // console.log(data)
          //   })
          console.log(socket.connected)
          socket.send(JSON.stringify({ type: 'create.task' }))
          socket.onAny((data) => console.log(data))
          //   socket.send('{"type":"create.task"}')
          //   socket.on(, (data: any) => {
          //     console.log(data)
          //   })
          setLoading(true)
          setTimeout(() => {
            print('No anda')
            setLoading(false)
          }, 1500)
          //   socketRef.current.send(command)
          //   socketRef.current.on(command, (data: any) => {
          //     console.log(data)
          //   })
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

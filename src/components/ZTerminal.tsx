import React, { useCallback } from 'react'
import { IconButton, makeStyles } from '@material-ui/core'
import { FaWindowMinimize, FaWindowRestore, FaWindowMaximize } from 'react-icons/fa'
import Terminal from 'terminal-in-react'
import { useSocket } from '../util/SocketContext'
import { useColorTheme } from '../util/Theme'
import { DetailWrapperProps } from './DetailWrapper'
import { useRef } from 'react'
import { forwardRef } from 'react'
import { useImperativeHandle } from 'react'
import FileImg from '../assets/images/document.png'

export type TerminalSize = 'minimizezd' | 'normal' | 'maximized'

interface Props extends DetailWrapperProps {
  terminalSize: TerminalSize
  onTerminalResize: (newSize: TerminalSize) => void
}

export type RefType = {
  writeConsole: (str: string) => void
  writeImg: (url: string, ext?: string) => void
}
export default forwardRef<RefType, Props>(({ terminalSize, onTerminalResize, hostname }, ref) => {
  const terminalRef = useRef<Terminal | null>()
  const { isDarkTheme } = useColorTheme()
  const classes = useClasses({ terminalSize, isDarkTheme })

  const { send, onMessage, onError } = useSocket()

  const handleSocket = useCallback(
    (command: string, print: (message: string) => void) => {
      onMessage((e) => {
        const { type, reference, content, error } = JSON.parse(e.data || '{}')
        if (type === 'task.created') {
          send({ type: 'shell.execute', command, reference }, true)
        } else if (content) {
          if (typeof content === 'string') print(content)
        } else if (error) {
          print(error)
        }
      })
      onError((e) => {
        print('Command not found')
      })
      send({ type: 'create.task' }, true)
    },
    [onMessage, onError, send],
  )

  const writeConsole = useCallback(async (str: string) => {
    terminalRef.current?.setState((act: any) => {
      const actual = act.instances.find((e: any) => e.index === act.activeTab) || act.instances[0]
      const { instance } = actual
      const { summary } = instance.state || {}
      summary.push(str)

      return { ...act }
    })
  }, [])

  const writeImg = useCallback(
    async (url: string, ext?: string) => {
      const isImage = ext === 'jpg' || ext === 'png' || ext === 'jpeg'
      await writeConsole('> sreenshot')

      terminalRef.current?.setState((act: any) => {
        const actual = act.instances.find((e: any) => e.index === act.activeTab) || act.instances[0]
        const { instance } = actual
        const { inputWrapper } = instance

        const div = document.createElement('div')
        const innerDiv = document.createElement('div')
        innerDiv.style.width = '85px'
        innerDiv.style.height = '85px'
        innerDiv.style.backgroundRepeat = 'no-repeat'
        innerDiv.style.backgroundImage = `url(${isImage ? url : FileImg})`
        innerDiv.style.backgroundPosition = 'left'
        innerDiv.style.backgroundSize = 'cover'

        const link = document.createElement('a')
        const linkText = document.createTextNode('Download')
        link.appendChild(linkText)
        link.title = 'Download'
        link.href = url
        link.target = '_blank'
        link.style.color = '#FFF'

        div.appendChild(innerDiv)
        div.appendChild(link)

        const wrapperDiv = inputWrapper as HTMLDivElement
        wrapperDiv.insertAdjacentHTML('beforebegin', div.outerHTML)

        return { ...act }
      })
    },
    [writeConsole],
  )

  useImperativeHandle(
    ref,
    () => ({
      writeConsole,
      writeImg,
    }),
    [writeConsole, writeImg],
  )

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
        ref={(e) => (terminalRef.current = e)}
        msg={hostname}
        commandPassThrough={(cmd, print: (message: string) => void) => {
          const [command] = cmd
          handleSocket(command, print)
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
})

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

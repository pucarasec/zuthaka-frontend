import React, {
  createContext,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useUser } from 'material-crud'
import Urls from './Urls'
import { useLogging } from './LoggingContext'

interface ContextProps {
  socket: WebSocket | null
  refresh?: () => void
  id: number
}

const initialContext: ContextProps = {
  socket: null,
  id: -1,
}

const SocketContext = createContext<ContextProps>(initialContext)

interface ProviderProps {
  children: ReactNode
  id: number
}

export const SocketProvider = memo(({ children, id }: ProviderProps) => {
  const { user } = useUser()
  const [attemps, setAttemps] = useState(0)

  const refresh = useCallback(() => setAttemps((acc) => acc + 1), [])

  const socket = useMemo(() => {
    console.log(attemps)
    const socket = new WebSocket(
      `${Urls.baseSocket}/agents/${id}/interact/?access_token=${user.token}`,
    )

    return socket
  }, [user.token, id, attemps])

  return <SocketContext.Provider value={{ socket, refresh, id }}>{children}</SocketContext.Provider>
})

type OnMessageProps = (e: MessageEvent) => void
type OnErrorProps = (e: CloseEvent) => void

export const useSocket = () => {
  const { socket, refresh, id } = useContext(SocketContext)
  const { logging } = useLogging()

  const isConnected = useMemo(() => socket?.readyState === socket?.OPEN, [socket])
  const callSend = useCallback(
    (data: object) => {
      if (isConnected) {
        const json = JSON.stringify(data)
        socket?.send(json)
        if (logging) console.log(json)
      }
    },
    [socket, isConnected, logging],
  )
  const callOnMessage = useCallback(
    (e: OnMessageProps) => {
      if (socket)
        socket.onmessage = (ev) => {
          e(ev)
          if (logging) console.log(ev)
        }
    },
    [socket, logging],
  )
  const callOnError = useCallback(
    (e: OnErrorProps) => {
      if (socket) {
        socket.onclose = (ev) => {
          e(ev)
          if (logging) console.log(ev)
          if (refresh) refresh()
        }
      }
    },
    [socket, refresh, logging],
  )

  return { send: callSend, onMessage: callOnMessage, onError: callOnError, id, isConnected }
}

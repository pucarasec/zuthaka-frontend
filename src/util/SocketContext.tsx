import React, { createContext, memo, ReactNode, useContext, useEffect, useMemo } from 'react'
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
import Urls from './Urls'

interface ContextProps {
  socket: Socket | null
}

const initialContext: ContextProps = {
  socket: null,
}

const SocketContext = createContext<ContextProps>(initialContext)

interface ProviderProps {
  children: ReactNode
  id: number
  options?: Partial<ManagerOptions & SocketOptions>
}

export const SocketProvider = memo(({ children, id, options }: ProviderProps) => {
  const socket = useMemo(
    () =>
      io('ws://192.168.102.50:8000', { path: '/agents/1/interact/', transports: ['websocket'] }),
    [],
  )

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
})

export const useSocket = () => {
  const { socket } = useContext(SocketContext)
  return socket
}

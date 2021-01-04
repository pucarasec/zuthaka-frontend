import React, { createContext, ReactNode, useContext } from 'react'
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client'

interface ContextProps {
  socket: Socket | null
}

const initialContext: ContextProps = {
  socket: null,
}

const SocketContext = createContext<ContextProps>(initialContext)

interface ProviderProps {
  children: ReactNode
  url: string
  options?: Partial<ManagerOptions & SocketOptions>
}

export const SocketProvider = ({ children, url, options }: ProviderProps) => {
  const socket = io(url, options)
  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  const { socket } = useContext(SocketContext)
  return socket
}

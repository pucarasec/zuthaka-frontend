import React from 'react'
import DetailAgent from '../screens/agents/DetailAgent'
import { SocketProvider } from '../util/SocketContext'

interface AgentProps {
  id: number
  c2: number
  listener: number
  creation_date: Date
  first_conection: Date
  last_conection: Date
  username: string
  hostname: string
}

export interface DetailWrapperProps extends Partial<AgentProps> {
  detached?: boolean
}

export default ({ detached, ...agent }: DetailWrapperProps) => {
  return (
    // <SocketProvider id={id}>
    <DetailAgent detached={detached} {...agent} />
    // </SocketProvider>
  )
}

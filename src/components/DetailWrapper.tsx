import React from 'react'
import { useLocation } from 'react-router-dom'
import DetailAgent from '../screens/agents/DetailAgent'
import { SocketProvider } from '../util/SocketContext'

interface AgentProps {
  id: number
  c2: number
  listener: number
  creation_date: Date
  first_conection: Date
  last_conection: Date
  shell_type: string
  username: string
  hostname: string
}

export interface DetailWrapperProps extends Partial<AgentProps> {
  detached?: boolean
}

export default ({ detached, ...agent }: DetailWrapperProps) => {
  const { search } = useLocation()
  const agentDetached = Object.fromEntries(new URLSearchParams(search))

  return (
    <SocketProvider id={agent.id || parseInt(agentDetached.id || '-1')}>
      <DetailAgent detached={detached} {...agent} {...agentDetached} />
    </SocketProvider>
  )
}

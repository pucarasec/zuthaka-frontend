import React from 'react'
import { useLocation } from 'react-router-dom'
import DetailAgent, { AgentProps } from '../screens/agents/DetailAgent'
import { SocketProvider } from '../util/SocketContext'

interface Props {
  detached: boolean
}

export default ({ detached }: Props) => {
  const { state } = useLocation<AgentProps>()
  return (
    // <SocketProvider id={state.id}>
      <DetailAgent detached={detached} />
    // </SocketProvider>
  )
}

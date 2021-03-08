import React, { useCallback, useRef, useState } from 'react'
import NewWindow, { IWindowFeatures } from 'react-new-window'
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
  openDetached?: ({ height, width }: IWindowFeatures) => void
}

export default ({ ...agent }: DetailWrapperProps) => {
  const [detached, setDetached] = useState(false)
  const handleDetached = useCallback((open: boolean) => setDetached(open), [])
  const sizeRef = useRef<IWindowFeatures | undefined>(undefined)

  return (
    <SocketProvider id={agent.id!!}>
      <DetailAgent
        detached={false}
        openDetached={({ height, width }) => {
          sizeRef.current = { height, width }
          handleDetached(true)
        }}
        {...agent}
      />
      {detached && (
        <NewWindow onUnload={() => handleDetached(false)} features={sizeRef.current} url="">
          {/* <DetailAgent detached {...agent} /> */}
        </NewWindow>
      )}
    </SocketProvider>
  )
}

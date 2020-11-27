import React, { ReactNode } from 'react'

interface Props {
  value: number
  index: number
  children: ReactNode
}

export default (props: Props) => {
  const { children, value, index } = props

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import Storage from '../util/Storage'

type StateProps = string[]

export default (name: 'LauncherPins' | 'ListenerPins') => {
  const [pins, setPins] = useState<StateProps>(() => Storage.getItem(name) || [])

  useEffect(() => {
    Storage.saveItem(name, pins)
  }, [name, pins])

  const savePins = useCallback((value: string | string[]) => {
    setPins((total) => {
      if (Array.isArray(value)) return [...total, ...value]
      if (total.includes(value)) return total
      return [...total, value]
    })
  }, [])

  const removePins = useCallback((value?: string | string[]) => {
    if (!value) setPins([])
    else
      setPins((total) =>
        total.filter((val) => (Array.isArray(value) ? !value.includes(val) : val !== value)),
      )
  }, [])

  return { pins, savePins, removePins }
}

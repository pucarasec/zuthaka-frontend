import { useCallback, useMemo, useState } from 'react'

export default (name: string) => {
  const getPins = useMemo(() => {
    const pins = localStorage.getItem(name)
    if (!pins) return []
    return JSON.parse(pins) as string[]
  }, [name])
  const [pins, setPins] = useState(getPins)

  const savePins = useCallback(
    (value: string | string[]) => {
      localStorage.setItem(name, JSON.stringify(pins.concat(value)))
      if (Array.isArray(value)) setPins([...pins, ...value])
      else setPins([...pins, value])
    },
    [name, pins],
  )

  const removePins = useCallback(
    (value?: string | string[]) => {
      if (!value) {
        localStorage.removeItem(name)
        setPins([])
      } else {
        const filtered = pins.filter((val) =>
          Array.isArray(value) ? !value.includes(val) : val !== value,
        )
        localStorage.setItem(name, JSON.stringify(filtered))
        setPins(filtered)
      }
    },
    [pins, name],
  )

  return { pins, savePins, removePins }
}

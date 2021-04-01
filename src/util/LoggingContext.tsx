import { useSnackbar } from 'notistack'
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { createContext } from 'react'
import Storage from './Storage'

type Context = [boolean, Dispatch<SetStateAction<boolean>>]
const LoggingContext = createContext<Context>([false, () => {}])

export const LoggingProvider = ({ children }: { children: ReactNode }) => {
  const state = useState(() => Storage.getItem<boolean>('LoggingZuthaka') || false)
  return <LoggingContext.Provider value={state}>{children}</LoggingContext.Provider>
}

export const useLogging = () => {
  const [logging, setLogging] = useContext(LoggingContext)
  const { enqueueSnackbar } = useSnackbar()

  const callSetLogging = useCallback(
    (value: boolean) => {
      setLogging(value)
      enqueueSnackbar(`Logging ${value ? 'activated' : 'desactivated'}`, { variant: 'info' })
    },
    [setLogging, enqueueSnackbar],
  )

  useEffect(() => {
    Storage.saveItem('LoggingZuthaka', logging.toString())
  }, [logging])

  return { logging, setLogging: callSetLogging }
}

import React, {
  createContext,
  Dispatch,
  memo,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useMediaQuery, useTheme } from '@material-ui/core'

interface ProviderProps {
  children: ReactNode
}

interface StateProps {
  isMobile?: boolean
}

const defaults: StateProps = {
  isMobile: undefined,
}

type ContextProps = [StateProps, Dispatch<SetStateAction<StateProps>>]
export const ResponsiveContext = createContext<ContextProps>([defaults, () => {}])

export const ResponsiveProvider = memo(({ children }: ProviderProps) => {
  const [value, setValue] = useState<StateProps>(defaults)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  useEffect(() => setValue((acc) => ({ ...acc, isMobile })), [isMobile])

  return (
    <ResponsiveContext.Provider value={[value, setValue]}>{children}</ResponsiveContext.Provider>
  )
})

export const useResponsive = () => {
  const [{ isMobile }] = useContext(ResponsiveContext)
  return isMobile
}

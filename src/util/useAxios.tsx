import { useAxios, UseAxiosProps, useUser } from 'material-crud'
import { CallProps, Error, ErrorResponse } from 'material-crud/dist/utils/useAxios'
import { useNavigator } from 'material-navigator'
import { OptionsObject, useSnackbar } from 'notistack'
import { useCallback, useRef } from 'react'
import Storage from '../util/Storage'
import { useLogging } from './LoggingContext'

type ResponseProps<T> = [
  T | undefined,
  boolean,
  CallProps,
  () => void,
  number | undefined,
  ErrorResponse | undefined,
]

type Enqueue = (message: React.ReactNode, options?: OptionsObject | undefined) => React.ReactText

export const mostrarError = (enqueueSnackbar: Enqueue) => (error: Error) => {
  let message = ''
  if (error.message) {
    message = error.message
  } else if (Array.isArray(error)) {
    message = error[0]
  } else if (typeof error === 'object' && error !== null) {
    const errorObject = error as any
    const first = errorObject[Object.keys(errorObject)[0]]
    if (Array.isArray(first)) message = first[0]
    else message = first
  } else {
    message = 'Error ocurred' // (error as string) || 'Error ocurred'
  }

  enqueueSnackbar(message, { variant: 'error' })
}

export default <T extends any>(props?: UseAxiosProps): ResponseProps<T> => {
  const { enqueueSnackbar } = useSnackbar()
  const { setUser } = useUser()
  const { logging } = useLogging()
  const { setLoading } = useNavigator()
  const unauthorizedRef = useRef(true)

  const onError = useCallback(
    (error: Error, status?: number) => {
      if (unauthorizedRef.current) {
        if (status === 401) {
          unauthorizedRef.current = false
          mostrarError(enqueueSnackbar)({
            message: 'Unauthorized. You must log in again',
            code: status,
          })
          setTimeout(() => {
            setUser(null)
            Storage.removeAll()
            setLoading(false)
          }, 500)
        } else {
          if (props && props.onError) {
            props.onError(error)
          } else {
            mostrarError(enqueueSnackbar)(error)
          }
        }
      }
    },
    [enqueueSnackbar, props, setUser, setLoading],
  )

  const { call, response, loading, status, error, clean } = useAxios<T>({
    ...props,
    onError: (e) => onError(e, status),
    logging,
  })
  return [response, !!loading, call, clean, status, error]
}

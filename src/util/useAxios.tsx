import { useAxios, UseAxiosProps } from 'material-crud'
import { CallProps, Error, ErrorResponse } from 'material-crud/dist/utils/useAxios'
import { OptionsObject, useSnackbar } from 'notistack'

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
  enqueueSnackbar(error.message, {
    variant: 'error',
  })
}

export default <T extends any>(props?: UseAxiosProps): ResponseProps<T> => {
  const { enqueueSnackbar } = useSnackbar()
  const { call, response, loading, status, error, clean } = useAxios<T>(
    props ? { ...props } : { onError: mostrarError(enqueueSnackbar) },
  )
  return [response, !!loading, call, clean, status, error]
}

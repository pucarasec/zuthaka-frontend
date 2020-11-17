import { Error } from 'material-crud/dist/utils/useAxios'
import { OptionsObject } from 'notistack'
type Enqueue = (message: React.ReactNode, options?: OptionsObject | undefined) => React.ReactText

export const axiosError = (enqueueSnackbar: Enqueue) => ({
  onError: (err: Error) => {
    enqueueSnackbar(`(${err.code}) ${err.message}`, { variant: 'error' })
  },
})

export const crudError = (enqueueSnackbar: Enqueue) => (error: Error) => {
  enqueueSnackbar(error.message, {
    variant: 'error',
  })
}

export const crudFinised = (enqueueSnackbar: Enqueue, que: string) => (
  what: 'new' | 'update' | 'delete' | 'add',
  genero?: 'F' | 'M',
) => {
  switch (what) {
    case 'new':
      enqueueSnackbar(`${que} agregad${genero === 'F' ? 'a' : 'o'}`, {
        variant: 'success',
      })
      break
    case 'update':
      enqueueSnackbar(`${que} editad${genero === 'F' ? 'a' : 'o'}`, {
        variant: 'success',
      })
      break
    case 'delete':
      enqueueSnackbar(`${que} borrad${genero === 'F' ? 'a' : 'o'}`, {
        variant: 'info',
      })
      break
  }
}

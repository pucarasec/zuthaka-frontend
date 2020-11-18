import { Crud, useWindowSize } from 'material-crud'
import { CrudProps } from 'material-crud/dist/components/Crud'
import { useNavigatorConfig } from 'material-navigator'
import { useSnackbar } from 'notistack'
import React from 'react'
import { mostrarError } from '../util/useAxios'

interface WSOptionsProps {
  description: string
  example: string
  name: string
  required: string
  type: string
}

export interface WSResponse<T = any> {
  count: number
  current: number
  next: string
  previous: string
  results: T
  //   results: (T & { options: WSOptionsProps })[]
}

type FullCrudProps = Omit<CrudProps, 'response'>

export default (props: FullCrudProps) => {
  const { name } = props
  useNavigatorConfig({ title: name, showUser: true })
  const { enqueueSnackbar } = useSnackbar()
  const { height } = useWindowSize()

  return (
    <Crud
      {...props}
      actions={{ edit: true, delete: true }}
      response={{
        list: (cList: any) => ({
          items: cList.results,
          page: cList.current,
          limit: 10,
          totalDocs: cList.count,
        }),
        new: (_: any, response: any) => response,
        edit: (_: any, response: any) => response,
      }}
      height={height - 190}
      interaction={{ page: 'page', perPage: 'limit' }}
      onError={mostrarError(enqueueSnackbar)}
      idInUrl
      onFinished={(what, genero) => {
        switch (what) {
          case 'new':
            enqueueSnackbar(`${name} agregad${genero === 'F' ? 'a' : 'o'}`, {
              variant: 'success',
            })
            break
          case 'update':
            enqueueSnackbar(`${name} editad${genero === 'F' ? 'a' : 'o'}`, {
              variant: 'success',
            })
            break
          case 'delete':
            enqueueSnackbar(`${name} borrad${genero === 'F' ? 'a' : 'o'}`, {
              variant: 'info',
            })
            break
        }
      }}
    />
  )
}

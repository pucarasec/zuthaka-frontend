import { Crud, FormTypes, useWindowSize, CrudRefProps } from 'material-crud'
import { CrudProps } from 'material-crud/dist/components/Crud'
import { useNavigatorConfig } from 'material-navigator'
import { useSnackbar } from 'notistack'
import React, { forwardRef } from 'react'
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
type RenderType = FormTypes.Input | FormTypes.Number | FormTypes.OnlyTitle | FormTypes.Secure

export const renderType = (type?: string): RenderType => {
  if (type === 'string') return FormTypes.Input
  else if (type === 'protected-string') return FormTypes.Secure
  else if (type === 'integer') return FormTypes.Number

  return FormTypes.OnlyTitle
}

export default forwardRef<CrudRefProps, FullCrudProps>((props, ref) => {
  const { name } = props
  useNavigatorConfig({ title: name, showUser: true })
  const { enqueueSnackbar } = useSnackbar()
  const { height } = useWindowSize()

  return (
    <Crud
      ref={ref}
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
      idInUrl
      itemId="id"
      noFilterOptions
      onError={mostrarError(enqueueSnackbar)}
      onFinished={(what, genero) => {
        const charGenero = genero === 'F' ? 'a' : 'o'
        switch (what) {
          case 'new':
            enqueueSnackbar(`${name} agregad${charGenero}`, {
              variant: 'success',
            })
            break
          case 'update':
            enqueueSnackbar(`${name} editad${charGenero}`, {
              variant: 'success',
            })
            break
          case 'delete':
            enqueueSnackbar(`${name} borrad${charGenero}`, {
              variant: 'info',
            })
            break
        }
      }}
      transform={(action, rowData) => {
        if (action === 'query') return { ...rowData, ...rowData.filter }
      }}
      transformFilter={(query) => {
        const keys = Object.keys(query)
        const finalFilter = keys.reduce((acc, it) => ({ ...acc, [it]: query[it].value }), {})
        return finalFilter
      }}
      {...props}
    />
  )
})

import React, { useEffect, useMemo } from 'react'
import { CenteredCard, createFields, Form, FormTypes, useUser } from 'material-crud'
import Urls from '../util/Urls'
import { useHistory, useLocation } from 'react-router-dom'
import { useNavigatorConfig } from 'material-navigator'
import useAxios from '../util/useAxios'

export interface LoginResponse {
  token: string | null
}

export default () => {
  const { setUser, user } = useUser()
  useNavigatorConfig({ title: 'Sign in', noSearch: true, showUser: !!user })
  const history = useHistory()
  const { state } = useLocation<{ from: string }>()
  const { from } = state || { from: { pathname: '/' } }
  const [response, loading, callLogin] = useAxios<LoginResponse>()

  useEffect(() => {
    if (user) {
      history.replace(from)
    } else if (response) {
      setUser(response)
    }
  }, [setUser, history, response, from, user])

  const fields = useMemo(
    () =>
      createFields([
        { id: 'username', title: 'User', type: FormTypes.Input },
        { id: 'password', title: 'Password', type: FormTypes.Secure, willSubmit: true },
      ]),
    [],
  )

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      <CenteredCard loading={loading} title="Log in">
        <Form
          loading={loading}
          onSubmit={(data) => callLogin({ url: Urls.login, method: 'POST', data })}
          accept="Sign in"
          fields={fields}
        />
      </CenteredCard>
    </div>
  )
}

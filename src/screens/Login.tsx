import React, { useEffect, useMemo } from 'react'
import { CenteredCard, createFields, Form, FormTypes, useUser } from 'material-crud'
import Urls from '../util/Urls'
import { useHistory, useLocation } from 'react-router-dom'
import { useNavigatorConfig } from 'material-navigator'
import useAxios from '../util/useAxios'
import LogoExtendido from '../assets/images/logoExtendido.png'
import { makeStyles } from '@material-ui/core'

export interface LoginResponse {
  token: string | null
}

export default () => {
  const classes = useClasses()
  const { setUser, user } = useUser()
  useNavigatorConfig({ title: 'Sign in', noSearch: true, showUser: !!user, noDrawerMenu: !user })
  const history = useHistory()
  const { state } = useLocation<{ from: { pathname: string } }>()
  const from = state?.from?.pathname || '/'
  const [response, loading, callLogin] = useAxios<LoginResponse>()

  useEffect(() => {
    if (user) {
      history.replace(from)
    } else if (response) {
      setUser(response)
      history.replace(from)
    }
  }, [setUser, history, response, from, state, user])

  const fields = useMemo(
    () =>
      createFields([
        { id: 'username', title: 'User', type: FormTypes.Input },
        { id: 'password', title: 'Password', type: FormTypes.Secure, willSubmit: true },
      ]),
    [],
  )

  return (
    <div className={classes.root}>
      <CenteredCard loading={loading}>
        <div className={classes.logo}>
          <img src={LogoExtendido} alt="logo extendido" height={50} />
        </div>
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

const useClasses = makeStyles((theme) => ({
  root: {
    width: '60%',
    margin: 'auto',
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
}))

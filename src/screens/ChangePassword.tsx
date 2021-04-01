import { CenteredCard, createFields, Form, FormTypes } from 'material-crud'
import { useNavigatorConfig } from 'material-navigator'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Urls from '../util/Urls'
import useAxios from '../util/useAxios'

export default () => {
  useNavigatorConfig({ title: 'User config', noSearch: true })
  const [, loading, call, , status, error] = useAxios()
  const history = useHistory()

  const fields = createFields([
    { id: 'current', title: 'Current password', type: FormTypes.Secure },
    { id: 'password', title: 'New password', type: FormTypes.Secure },
  ])

  useEffect(() => {
    if (status === 201) {
      history.push('/')
    }
  }, [history, status, error])

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      <CenteredCard loading={loading} title="Change password">
        <Form
          loading={loading}
          onSubmit={(data) => call({ url: Urls.changePassword, method: 'POST', data })}
          fields={fields}
          accept="Save"></Form>
      </CenteredCard>
    </div>
  )
}

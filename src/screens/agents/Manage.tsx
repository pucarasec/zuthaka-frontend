import { Button, makeStyles } from '@material-ui/core'
import { createFields, Form, FormTypes } from 'material-crud'
import React, { useMemo } from 'react'

export default () => {
  const classes = useClasses()

  const fields = useMemo(
    () =>
      createFields([
        [
          { id: 'hostname', title: 'Hostname', type: FormTypes.Input },
          { id: 'listener', title: 'Listener', type: FormTypes.Input },
          {
            id: 'conn_frecuency',
            title: 'Connection frecuency',
            type: FormTypes.Number,
            help: 'Per minute',
          },
        ],
        [
          { id: 'type', title: 'Type', type: FormTypes.Input },
          { id: 'last_seen', title: 'Last seen', type: FormTypes.Input },
          {
            id: 'history',
            type: FormTypes.Custom,
            component: () => (
              <div className={classes.bottonRoot}>
                <Button>History</Button>
              </div>
            ),
          },
        ],
      ]),
    [classes],
  )
  return <Form fields={fields}></Form>
}

const useClasses = makeStyles(() => ({
  bottonRoot: {
    display: 'flex',
    alignItems: 'center',
  },
}))

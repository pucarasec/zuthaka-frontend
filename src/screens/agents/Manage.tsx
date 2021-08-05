import React, { useMemo } from 'react'
import { createFields, Form, FormTypes } from 'material-crud'

interface IManage {
  last_conection?: Date
  hostname?: string
  shell_type?: string
  listener?: number
}

export default ({ hostname, last_conection, shell_type, listener }: IManage) => {
  // const classes = useClasses()

  const fields = useMemo(
    () =>
      createFields([
        [
          { id: 'hostname', title: 'Hostname', type: FormTypes.Input, defaultValue: hostname },
          { id: 'listener', title: 'Listener', type: FormTypes.Input, defaultValue: listener },
          // {
          //   id: 'conn_frecuency',
          //   title: 'Connection frecuency',
          //   type: FormTypes.Number,
          //   help: 'Per minute',
          // },
        ],
        [
          { id: 'type', title: 'Type', type: FormTypes.Input, defaultValue: shell_type },
          {
            id: 'last_seen',
            title: 'Last seen',
            type: FormTypes.Date,
            defaultValue: last_conection,
          },
          // {
          //   id: 'history',
          //   type: FormTypes.Custom,
          //   component: () => (
          //     <div className={classes.bottonRoot}>
          //       <Button>History</Button>
          //     </div>
          //   ),
          // },
        ],
      ]),
    [],
  )
  return <Form fields={fields}></Form>
}

// const useClasses = makeStyles(() => ({
//   bottonRoot: {
//     display: 'flex',
//     alignItems: 'center',
//   },
// }))

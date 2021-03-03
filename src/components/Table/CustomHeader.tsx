import React, { useCallback } from 'react'
import { Button, makeStyles, TableCell } from '@material-ui/core'
import { ColumnsProps } from 'material-crud/dist/components/Table/TableTypes'

interface Props {
  col?: Partial<ColumnsProps>
}

const CustomHeader = ({ col }: Props) => {
  const classes = useClasses({ width: col?.width })

  const renderContent = useCallback(() => {
    if (!col) return null

    return (
      <Button
        size="small"
        disableFocusRipple={!col.sort}
        disableTouchRipple={!col.sort}
        disableRipple={!col.sort}
        onClick={() => {
          if (!col || !col.sort) return null
        }}
        color="inherit"
        style={{
          cursor: col.sort ? 'pointer' : 'default',
        }}>
        {col.title}
      </Button>
    )
  }, [col])

  return (
    <TableCell component="div" variant="head" className={classes.cell}>
      {renderContent()}
    </TableCell>
  )
}

const useClasses = makeStyles(() => ({
  cell: ({ width }: any) => ({
    borderBottomWidth: 0,
    flex: 1,
    flexGrow: width,
    display: 'flex',
    justifyContent: 'flex-start',

    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
}))

export default CustomHeader

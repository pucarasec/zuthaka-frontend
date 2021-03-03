import React, { useCallback, useMemo } from 'react'
import { makeStyles, TableCell, Tooltip, Typography } from '@material-ui/core'
import { TableTypes } from 'material-crud'
import { ColumnsProps } from 'material-crud/dist/components/Table/TableTypes'

interface Props {
  rowData: any
  col?: Partial<ColumnsProps>
}

const CustomCell = ({ rowData, col }: Props) => {
  const classes = useClasses({ width: col?.width })
  const cellData = useMemo(() => {
    if (col && col.id) return rowData[col.id]
  }, [col, rowData])

  const renderContent = useCallback(() => {
    let finalString = cellData || '-'

    let noWrap = true
    finalString = String(finalString)
    const notTruncated = finalString
    if (col?.type === TableTypes.String) {
      if (col.noWrap !== undefined) noWrap = col.noWrap
      if (col.truncate) finalString = (finalString as string).substring(0, col.truncate) + '...'
    }

    return (
      <Tooltip title={notTruncated}>
        <Typography variant="body2" noWrap={noWrap}>
          {finalString}
        </Typography>
      </Tooltip>
    )
  }, [col, cellData])

  return (
    <TableCell component="div" variant="body" className={classes.cell}>
      {renderContent()}
    </TableCell>
  )
}

const useClasses = makeStyles((theme) => ({
  cell: ({ width }: any) => ({
    flex: 1,
    flexDirection: 'column',
    flexGrow: width,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    border: '1px solid #dee2e6',

    overflow: 'hidden',
    textOverflow: 'ellipsis',

    padding: theme.spacing(1),
  }),
}))

export default CustomCell

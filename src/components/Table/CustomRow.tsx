import React, { useCallback } from 'react'
import { makeStyles, TableRow } from '@material-ui/core'
import { ListChildComponentProps } from 'react-window'
import { ColumnsProps } from 'material-crud/dist/components/Table/TableTypes'
import CustomCell from './CustomCell'
import CustomHeader from './CustomHeader'

export interface RightClickRow {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>
  rowData: any
  index: number
}

interface RowProps extends Partial<ListChildComponentProps> {
  onRightClickRow?: (props: RightClickRow) => void
  isHeader?: boolean
  index: number
  columns: ColumnsProps[]
  rowData: any
}

const CustomRow = ({ index, style, isHeader, columns, onRightClickRow, rowData }: RowProps) => {
  const classes = useClasses({ index })

  const renderContent = useCallback(() => {
    if (isHeader) {
      return columns.map((col) => <CustomHeader key={col.id} col={col} />)
    }

    return columns.map((col) => <CustomCell key={col.id} col={col} rowData={rowData} />)
  }, [columns, isHeader, rowData])

  return (
    <TableRow
      onContextMenu={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        event.stopPropagation()
        onRightClickRow && onRightClickRow({ event, rowData, index })
      }}
      component="div"
      className={`${classes.row} ${isHeader ? classes.rowHeader : ''}`}
      style={style}>
      {renderContent()}
    </TableRow>
  )
}

const useClasses = makeStyles((theme) => ({
  row: ({ index }: any) => ({
    display: 'flex',
    backgroundColor:
      index % 2 !== 0 ? undefined : theme.palette.grey[theme.palette.type === 'dark' ? 600 : 200],
  }),
  rowHeader: {
    paddingRight: theme.spacing(2),
    boxShadow: theme.shadows[1],
  },
}))

export default CustomRow

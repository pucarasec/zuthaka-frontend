import React from 'react'
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'

type Align = 'left' | 'right' | 'center'

interface Props {
  columns: { title: string; align?: Align }[]
  rows: { name: string; align?: Align }[]
}

const DenseTable = ({ columns, rows }: Props) => {
  const classes = useClasses()

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {columns.map(({ title, align }) => (
              <TableCell className={classes.header} key={title} align={align}>
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {rows.map(({ name, align }) => (
              <TableCell key={name} component="th" scope="row" align={align}>
                {name}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const useClasses = makeStyles(() => ({
  container: {
    border: '1px solid black',
  },
  table: {
    width: '100%',
  },
  header: {
    fontWeight: 'bold',
  },
}))

export default DenseTable

import React, { useCallback, useState } from 'react'
import {
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { RenderType } from './FullCrud'
import { FormTypes } from 'material-crud'

type Align = 'left' | 'right' | 'center'

interface Props {
  columns: { title: string; align?: Align }[]
  rows: { name: string; align?: Align; type?: RenderType }[]
}

interface ProtectedCellProps {
  value: string
}

const ProtectedCell = ({ value }: ProtectedCellProps) => {
  const [show, setShow] = useState(false)

  const renderHide = useCallback(() => [...value].map(() => '*'), [value])

  return (
    <div style={{ display: 'flex' }}>
      <span style={{ flex: 1 }}>{show ? value : renderHide()}</span>
      <Tooltip title={show ? 'Hide' : 'Show'}>
        <div>
          <IconButton size="small" onClick={() => setShow(!show)}>
            {!show ? <FaEye /> : <FaEyeSlash />}
          </IconButton>
        </div>
      </Tooltip>
    </div>
  )
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
            {rows.map(({ name, align, type }) => (
              <TableCell key={name} component="th" scope="row" align={align}>
                {type === FormTypes.Secure ? <ProtectedCell value={name} /> : name}
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

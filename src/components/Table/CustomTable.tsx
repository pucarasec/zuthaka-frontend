import React from 'react'
import { makeStyles, Paper, Typography } from '@material-ui/core'
import { useWindowSize } from 'material-crud'
import CustomRow, { RightClickRow } from './CustomRow'
import { ColumnsProps } from 'material-crud/dist/components/Table/TableTypes'
import { VariableSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

interface TableProps {
  columns: ColumnsProps[]
  data: any[]
  onRightClickRow?: (props: RightClickRow) => void
}

const CustomTable = ({ columns, data, onRightClickRow }: TableProps) => {
  const { height } = useWindowSize()
  const classes = useClasses({ height })

  return (
    <Paper elevation={5} className={classes.container}>
      <CustomRow index={-1} isHeader columns={columns} rowData={data[-1]} />
      {data.length === 0 && (
        <div className={classes.noResult}>
          <Typography variant="body2">No results</Typography>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <AutoSizer>
          {({ height: tableHeight, width }) => (
            <List height={tableHeight} itemCount={data.length} itemSize={() => 48} width={width}>
              {(props) => (
                <CustomRow
                  {...props}
                  columns={columns}
                  rowData={data[props.index]}
                  onRightClickRow={onRightClickRow}
                />
              )}
            </List>
          )}
        </AutoSizer>
      </div>
    </Paper>
  )
}

const useClasses = makeStyles((theme) => ({
  container: ({ height }: any) => ({
    height: height,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  }),
  noResult: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export default CustomTable

import React from 'react'
import { makeStyles, Paper, Typography } from '@material-ui/core'
import { useWindowSize } from 'material-crud'
import CustomRow, { ClickRow } from './CustomRow'
import { ColumnsProps } from 'material-crud/dist/components/Table/TableTypes'
import { VariableSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

interface TableProps {
  columns: ColumnsProps[]
  data: any[]
  tableHeight?: number
  onClickRow?: (props: ClickRow) => void
  onRightClickRow?: (props: ClickRow) => void
}

const CustomTable = ({ columns, data, tableHeight, onClickRow, onRightClickRow }: TableProps) => {
  const { height } = useWindowSize()
  const classes = useClasses({ height: tableHeight || height })

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
          {({ height: autoHeight, width }) => (
            <List
              height={tableHeight || autoHeight}
              itemCount={data.length}
              itemSize={() => 48}
              width={width}>
              {(props) => (
                <CustomRow
                  {...props}
                  columns={columns}
                  rowData={data[props.index]}
                  onClickRow={onClickRow}
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

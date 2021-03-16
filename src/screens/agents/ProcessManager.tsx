import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSocket } from '../../util/SocketContext'
import { useSnackbar } from 'notistack'
import CustomTable from '../../components/Table/CustomTable'
import { createColumns, TableTypes } from 'material-crud'
import { ClickRow } from '../../components/Table/CustomRow'
import MenuIcon, { MenuIconOptionsProps } from '../../components/MenuIcon'
import { FaInfoCircle, FaSyringe, FaTimesCircle } from 'react-icons/fa'
import ZDialog from '../../components/ZDialog'
import { DialogContent, Typography } from '@material-ui/core'
import { useNavigator } from 'material-navigator'

interface DataProps {
  name: string
  permission: string
  pid: string
  additional_info: string
}

const initialStateMenu = {
  mouseX: null,
  mouseY: null,
}

const ProcessManager = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { setLoading } = useNavigator()

  const [openDialog, setOpenDialog] = useState(false)
  const handleDialog = useCallback((value: boolean) => setOpenDialog(value), [])

  const rowDataRef = useRef<DataProps | null>(null)
  const [data, setData] = useState<DataProps[]>([])
  const columns = useMemo(
    () =>
      createColumns([
        { id: 'pid', title: 'PID', type: TableTypes.String, width: 2 },
        { id: 'name', title: 'Name', type: TableTypes.String, width: 5 },
        { id: 'permission', title: 'Permission', type: TableTypes.String, width: 3 },
      ]),
    [],
  )

  const listRef = useRef(false)
  const { send, onError, onMessage } = useSocket()

  const handleSocket = useCallback(
    (typeAction: 'list' | 'terminate' | 'inject', pid?: string) => {
      onMessage((e) => {
        const { type, reference, content } = JSON.parse(e.data || '{}')
        if (type === 'task.created') {
          setLoading(true, 'bottomRight')
          switch (typeAction) {
            case 'list':
              send({ type: 'process_manager.list', reference })
              break
            case 'terminate':
              send({ type: 'process_manager.terminate', reference, pid })
              break
            case 'inject':
              send({ type: 'process_manager.inject', reference, pid })
              break
            default:
              break
          }
        } else if (content) {
          setLoading(false)
          switch (type) {
            case 'process_manager.list.result':
              setData(content)
              break
            case 'process_manager.terminate.result':
            case 'process_manager.inject.result':
              enqueueSnackbar(content)
              break
            default:
              break
          }
        }
      })
      onError((e) => {
        setLoading(false)
        enqueueSnackbar('Error ocurred')
      })
      send({ type: 'create.task' })
    },
    [send, onMessage, onError, enqueueSnackbar, setLoading],
  )

  const [anchorEl, setAnchorEl] = useState<{ mouseX: null | number; mouseY: null | number }>(
    initialStateMenu,
  )
  const callCloseMenu = useCallback(() => setAnchorEl(initialStateMenu), [])
  const menuOptions = useMemo<MenuIconOptionsProps[]>(
    () => [
      {
        icon: <FaSyringe />,
        title: 'Inject',
        onSelect: () => handleSocket('inject', rowDataRef.current?.pid),
      },
      {
        icon: <FaTimesCircle />,
        title: 'Terminate',
        onSelect: () => handleSocket('terminate', rowDataRef.current?.pid),
      },
      {
        icon: <FaInfoCircle />,
        title: 'Additional Info',
        onSelect: () => handleDialog(true),
      },
    ],
    [handleSocket, handleDialog],
  )

  const handleRightClickRow = useCallback(({ event, rowData }: ClickRow) => {
    rowDataRef.current = rowData
    setAnchorEl({ mouseX: event.clientX - 2, mouseY: event.clientY - 4 })
  }, [])

  useEffect(() => {
    if (!listRef.current) {
      handleSocket('list')
      listRef.current = true
    }
  }, [handleSocket, data])

  return (
    <div>
      <CustomTable data={data} columns={columns} onRightClickRow={handleRightClickRow} />
      <MenuIcon
        callCloseMenu={callCloseMenu}
        options={menuOptions}
        open={anchorEl.mouseY !== null}
        onClose={callCloseMenu}
        anchorPosition={
          anchorEl.mouseY !== null && anchorEl.mouseX !== null
            ? { top: anchorEl.mouseY, left: anchorEl.mouseX }
            : undefined
        }
      />
      <ZDialog open={openDialog} setOpen={handleDialog} title="Additional info">
        <DialogContent dividers>
          <Typography variant="body2" gutterBottom style={{ fontWeight: 'bold' }}>
            USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {rowDataRef.current?.additional_info}
          </Typography>
        </DialogContent>
      </ZDialog>
    </div>
  )
}

export default ProcessManager

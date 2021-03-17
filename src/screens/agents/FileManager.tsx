import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { ChonkyActions, ChonkyIconName, defineFileAction, FullFileBrowser } from 'chonky'
import {
  Card,
  CardActions,
  CircularProgress,
  DialogContent,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { SnackbarKey, useSnackbar } from 'notistack'
import './chonky.css'
import { useSocket } from '../../util/SocketContext'
import { callWs, useUser } from 'material-crud'
import Urls from '../../util/Urls'
import { useDropzone } from 'react-dropzone'
import { useColorTheme } from '../../util/Theme'
import ZDialog from '../../components/ZDialog'

export default memo(() => {
  const { isDarkTheme } = useColorTheme()
  const classes = useClasses({ isDarkTheme })
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { send, onError, onMessage, id } = useSocket()
  const { headers } = useUser()

  const snacksRef = useRef<SnackbarKey[]>([])
  const listRef = useRef(false)

  const fileRef = useRef<string | null>(null)
  const downloadRef = useRef('')

  const [openDialog, setOpenDialog] = useState(false)
  const handleDialog = useCallback((value: boolean) => setOpenDialog(value), [])

  const rowDataRef = useRef<string[] | null>(null)

  const [files, setFiles] = useState<any[]>([null])
  const [actualFolder, setActualFolder] = useState('/home/')
  const [folderChain, setFolderChain] = useState([{ id: 'home', name: 'Home' }])

  const showNotification = useCallback(
    (message: string) => {
      const snack = enqueueSnackbar(message, {
        persist: true,
        content: (key, message) => {
          return (
            <Card key={key} className={classes.card}>
              <CardActions classes={{ root: classes.actionRoot }}>
                <Typography variant="subtitle2" className={classes.typography}>
                  {message}
                </Typography>
                <CircularProgress className={classes.loading} />
              </CardActions>
            </Card>
          )
        },
      })
      snacksRef.current.push(snack)

      setTimeout(() => {
        closeSnackbar(snacksRef.current.find((e) => e === snack))
      }, 5000)
    },
    [classes, closeSnackbar, enqueueSnackbar],
  )

  const handleSocket = useCallback(
    (typeAction: 'list' | 'upload' | 'download', data?: any) => {
      onMessage(async (e) => {
        const { type, reference, content } = JSON.parse(e.data || '{}')
        if (type === 'task.created') {
          switch (typeAction) {
            case 'list':
              send({ type: 'file_manager.list_directory', directory: data, reference })
              break
            case 'download':
              downloadRef.current = data
              send({
                type: 'file_manager.download',
                file_path: `${actualFolder}${data}`,
                reference,
              })
              break
            case 'upload':
              const formData = new FormData()
              formData.append('file', data)
              formData.append('task-reference', reference)
              const { response } = await callWs<{ transition_file: string }>({
                method: 'POST',
                url: Urls.agents_upload(id),
                headers: { ...headers, 'content-type': 'multipart/form-data' },
                data: formData,
              })
              if (response) {
                fileRef.current = response?.transition_file
                send({ type: 'file_manager.upload', target_directory: actualFolder, reference })
              }
              break
            default:
              break
          }
        } else if (content) {
          if (content.error) {
            showNotification(content.error)
          } else {
            switch (type) {
              case 'file_manager.list_directory.result':
                const { files, directories } = content
                setFiles([
                  ...files.map(({ name, size, date, additional_info }: any) => ({
                    id: name,
                    name,
                    size: parseInt(size),
                    modDate: date,
                    additional_info,
                  })),
                  ...directories.map(({ name, date }: any) => ({
                    id: name,
                    name,
                    isDir: true,
                    modDate: date,
                  })),
                ])
                break
              case 'file_manager.download.result':
                const { response } = await callWs<Blob>({
                  url: Urls.agents_download(id),
                  responseType: 'blob',
                  params: { 'task-reference': reference },
                  headers,
                })
                if (response) {
                  const url = window.URL.createObjectURL(new Blob([response]))
                  const link = document.createElement('a')
                  link.href = url
                  link.setAttribute('download', downloadRef.current)
                  document.body.appendChild(link)
                  link.click()
                  link.remove()
                }
                break
              case 'file_manager.upload.result':
                showNotification(content)
                const newFile = fileRef.current?.replace('/', '')
                setFiles((acc) => [...acc, { id: newFile, name: newFile }])
                break
              default:
                break
            }
          }
        }
      })
      onError((e) => {
        showNotification('Error ocurred')
      })
      send({ type: 'create.task' })
    },
    [onMessage, onError, showNotification, send, id, headers, actualFolder],
  )

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 3,
    noDragEventsBubbling: true,
    noKeyboard: true,
    noClick: true,
    onDrop: (files) => {
      if (files) {
        for (const file of files) {
          handleSocket('upload', file)
        }
      }
    },
  })

  useEffect(() => {
    const parent = document.getElementById('divContainer')?.parentElement
    if (parent) {
      parent.style.height = '100%'
      parent.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        e.stopPropagation()
        return false
      })
    }
  }, [])

  useEffect(() => {
    if (!listRef.current) {
      handleSocket('list', actualFolder)
      listRef.current = true
    }
  }, [handleSocket, actualFolder])

  const infoAction = defineFileAction(
    {
      id: 'infoAction',
      fileFilter: (file: any) => !file?.isDir,
      requiresSelection: true,
      button: {
        name: 'Additional Info',
        toolbar: true,
        icon: ChonkyIconName.info,
        iconOnly: true,
        tooltip: 'Additional Info',
      },
    } as const,
    ({ state }) => {
      rowDataRef.current = state.selectedFilesForAction.map(
        ({ additional_info }) => additional_info,
      )
      setOpenDialog(true)
    },
  )

  const downloadAction = defineFileAction(
    {
      id: 'downloadAction',
      requiresSelection: true,
      fileFilter: (file: any) => !file?.isDir,
      button: {
        name: 'Download',
        toolbar: true,
        icon: ChonkyIconName.download,
        tooltip: 'Download',
      },
    } as const,
    ({ state }) => {
      for (const file of state.selectedFilesForAction) {
        if (!file.isDir) {
          handleSocket('download', file.name)
        }
      }
    },
  )

  return (
    <div id="divContainer" {...getRootProps({ className: classes.dropzone })}>
      <input {...getInputProps({ multiple: true, type: 'file' })} />
      <FullFileBrowser
        files={files}
        folderChain={folderChain}
        clearSelectionOnOutsideClick
        darkMode={isDarkTheme}
        disableDefaultFileActions={[
          ChonkyActions.SelectAllFiles.id,
          ChonkyActions.OpenSelection.id,
        ]}
        defaultFileViewActionId={ChonkyActions.EnableListView.id}
        fileActions={[downloadAction, infoAction]}
        onFileAction={(data) => {
          if (data.id === ChonkyActions.OpenFiles.id) {
            const { targetFile } = data.payload
            const stringPath = actualFolder.split('/')
            const index = stringPath.findIndex((text) => text === targetFile?.id)
            const newActualFolder = `${stringPath.slice(0, index + 1).join('/')}/`
            setActualFolder(newActualFolder)
            setFolderChain((acc) => {
              const i = acc.findIndex(({ id }) => id === targetFile?.id)
              return acc.slice(0, i + 1)
            })
            handleSocket('list', newActualFolder)
          } else if (data.id === ChonkyActions.MouseClickFile.id) {
            const { file, ctrlKey } = data.payload
            if (file.isDir && !ctrlKey) {
              setActualFolder((acc) => `${acc}${file.id}/`)
              setFolderChain((acc) => [...acc, { id: file.id, name: file.id }])
              handleSocket('list', `${actualFolder}${file.id}`)
            }
          }
        }}
      />
      <ZDialog open={openDialog} setOpen={handleDialog} title="Additional info" maxWidth="sm">
        <DialogContent dividers>
          <Typography variant="body2" gutterBottom style={{ fontWeight: 'bold' }}>
            USER PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND
          </Typography>
          {rowDataRef.current?.map((message) => (
            <Typography key={message} variant="subtitle1" gutterBottom>
              {message}
            </Typography>
          ))}
        </DialogContent>
      </ZDialog>
    </div>
  )
})

const useClasses = makeStyles((theme) => ({
  card: {
    maxWidth: 400,
    minWidth: 344,
  },
  typography: {
    fontWeight: 'bold',
    flex: 1,
    color: 'white',
  },
  actionRoot: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  action: {
    margin: 0,
  },
  loading: {
    color: 'white',
    padding: 8,
  },
  dropzone: ({ isDarkTheme }: any) => ({
    // position: 'relative',
    // margin: 'auto',
    // marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(1),
    // width: '100%',
    height: '100%',
    zIndex: theme.zIndex.drawer + 1,
    // padding: theme.spacing(1),
    // borderStyle: 'dashed',
    // borderColor: '#eeeeee',
    // borderWidth: 5,
    // display: 'none',
    // alignItems: 'center',
    // justifyContent: 'center',
    // flexDirection: 'column',
    // backgroundColor: isDarkTheme ? 'black' : 'white',
  }),
}))

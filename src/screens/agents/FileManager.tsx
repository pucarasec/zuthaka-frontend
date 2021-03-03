import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { ChonkyActions, FullFileBrowser } from 'chonky'
import { Card, CardActions, CircularProgress, makeStyles, Typography } from '@material-ui/core'
import { SnackbarKey, useSnackbar } from 'notistack'
import './chonky.css'
import { useSocket } from '../../util/SocketContext'
import { callWs, useUser } from 'material-crud'
import Urls from '../../util/Urls'
import { useDropzone } from 'react-dropzone'
import { useColorTheme } from '../../util/Theme'

export default memo(() => {
  const { isDarkTheme } = useColorTheme()
  const classes = useClasses({ isDarkTheme })
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { send, onError, onMessage, id } = useSocket()
  const { headers } = useUser()

  const snacksRef = useRef<SnackbarKey[]>([])
  const listRef = useRef(false)
  // const uploadFileRef = useRef<HTMLInputElement | null>(null)
  const fileRef = useRef<string | null>(null)
  const downloadRef = useRef('')

  const [files, setFiles] = useState<any[]>([null])
  const folderChain = [
    { id: 'home', name: 'Home', openable: false },
    { id: 'dev2', name: 'Dev2' },
  ]

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
              send({ type: 'file_manager.list_directory', directory: '/home/dev2/', reference })
              break
            case 'download':
              downloadRef.current = data[0].id
              send({
                type: 'file_manager.download',
                file_path: `/home/dev2/${data[0].id}`,
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
                send({ type: 'file_manager.upload', target_directory: '/home/dev2/', reference })
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
                  ...files.map(({ name }: any) => ({ id: name, name })),
                  ...directories.map(({ name }: any) => ({ id: name, name, isDir: true })),
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
    [onMessage, onError, showNotification, send, id, headers],
  )

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 3,
    noDragEventsBubbling: true,
    noKeyboard: true,
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
      handleSocket('list')
      listRef.current = true
    }
  }, [handleSocket])

  return (
    <div id="divContainer" style={{ height: '100%' }}>
      <div {...getRootProps({ className: classes.dropzone })}>
        <input {...getInputProps({ multiple: true, type: 'file' })} />
        <p>To upload drag and drop some files here, or click to select files. Max 3 files.</p>
      </div>
      <FullFileBrowser
        files={files}
        folderChain={folderChain}
        fileActions={[ChonkyActions.DownloadFiles]}
        onFileAction={(action) => {
          if (action.id === ChonkyActions.DownloadFiles.id) {
            handleSocket('download', action.state.selectedFilesForAction)
          }
        }}
        disableDragAndDrop
        darkMode={isDarkTheme}
      />
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
    position: 'relative',
    margin: 'auto',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '90%',
    height: 50,
    padding: theme.spacing(1),
    borderStyle: 'dashed',
    borderColor: '#eeeeee',
    borderWidth: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: isDarkTheme ? 'black' : 'white',
  }),
}))

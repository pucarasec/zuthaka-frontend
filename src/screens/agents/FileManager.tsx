import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { ChonkyActions, FileActionData, FullFileBrowser } from 'chonky'
import { Card, CardActions, CircularProgress, makeStyles, Typography } from '@material-ui/core'
import { SnackbarKey, useSnackbar } from 'notistack'
import './chonky.css'
import { useSocket } from '../../util/SocketContext'
import { useNavigator } from 'material-navigator'
import { callWs, useUser } from 'material-crud'
import Urls from '../../util/Urls'

export default memo(() => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const classes = useClasses()
  const { setLoading } = useNavigator()
  const { send, onError, onMessage, id } = useSocket()
  const { headers } = useUser()

  const snacksRef = useRef<SnackbarKey[]>([])
  const listRef = useRef(false)
  const uploadFileRef = useRef<HTMLInputElement | null>(null)
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
          setLoading(false)
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
                setLoading(true)
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
                setLoading(false)
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
        setLoading(false)
        showNotification('Error ocurred')
      })
      send({ type: 'create.task' })
    },
    [onMessage, onError, showNotification, send, setLoading, id, headers],
  )

  const handleActions = useCallback(
    (action: FileActionData<any>) => {
      const { id } = action
      switch (id) {
        case ChonkyActions.DownloadFiles.id:
          handleSocket('download', action.state.selectedFilesForAction)
          break
        case ChonkyActions.UploadFiles.id:
          uploadFileRef.current?.click()
          break
        default:
          break
      }
    },
    [handleSocket],
  )

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
      <FullFileBrowser
        files={files}
        folderChain={folderChain}
        fileActions={[ChonkyActions.DownloadFiles, ChonkyActions.UploadFiles]}
        onFileAction={handleActions}
      />
      <input
        multiple
        max={3}
        type="file"
        ref={(e) => (uploadFileRef.current = e)}
        onChange={(e) => {
          const { files } = e.target
          if (files) {
            for (const file of files) {
              handleSocket('upload', file)
            }
          }
        }}
        className={classes.fileInput}
      />
    </div>
  )
})

const useClasses = makeStyles((theme) => ({
  fileInput: {
    display: 'none',
  },
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
}))

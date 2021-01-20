import React, { memo, useCallback, useEffect, useRef } from 'react'
import { ChonkyActions, FileActionData, FullFileBrowser } from 'chonky'
import {
  Card,
  CardActions,
  CircularProgress,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core'
import { useSnackbar } from 'notistack'

export default memo(() => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const uploadFileRef = useRef<HTMLInputElement | null>(null)
  const files = [
    { id: 'lht', name: 'Projects', isDir: true },
    {
      id: 'mcd',
      name: 'chonky-sphere-v2.png',
      thumbnailUrl: 'https://chonky.io/chonky-sphere-v2.png',
    },
  ]

  const folderChain = [{ id: 'home', name: '/home', isDir: true }]

  const handleActions = useCallback((action: FileActionData<any>) => {
    const { id } = action
    switch (id) {
      case ChonkyActions.DownloadFiles.id:
        console.log(action)
        break
      case ChonkyActions.UploadFiles.id:
        console.log(action)
        uploadFileRef.current?.click()
        break
      default:
        console.log(id, ChonkyActions.UploadFiles.id)
        break
    }
  }, [])

  const classes = useClasses()

  return (
    <div>
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
              const snack = enqueueSnackbar(`Uploading file ${file.name}`, {
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

              setTimeout(() => {
                closeSnackbar(snack)
              }, 5000)
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

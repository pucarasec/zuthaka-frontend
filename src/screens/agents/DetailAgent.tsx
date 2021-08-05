import { AppBar, makeStyles, Tab, Tabs, IconButton } from '@material-ui/core'
import { useNavigatorConfig } from 'material-navigator'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import TabPanel from '../../components/TabPanel'
import { useWindowSize } from 'material-crud'
import Manage from './Manage'
import FileManager from './FileManager'
import ProcessManager from './ProcessManager'
import PostExploitation from './PostExploitation'
import Storage from '../../util/Storage'
import ZTerminal, { TerminalSize, RefType } from '../../components/ZTerminal'
import { DetailWrapperProps } from '../../components/DetailWrapper'

export default ({ detached, ...agent }: DetailWrapperProps) => {
  const terminalRef = useRef<RefType | null>(null)

  useNavigatorConfig(
    detached ? { onlyContent: true } : { title: 'Agents', noPadding: true, goBack: true },
  )
  const { height } = useWindowSize()
  const [value, setValue] = useState(0)

  const [terminalSize, setTerminalSize] = useState<TerminalSize>('normal')
  const classes = useClasses({ height, terminalSize, detached })

  const handleChange = useCallback((newValue: number) => setValue(newValue), [])

  useLayoutEffect(() => {
    const saveSize = () => {
      if (detached) {
        Storage.saveItem('DetachedSize', { height: window.innerHeight, width: window.innerWidth })
      }
    }
    window.addEventListener('resize', saveSize)
    return () => window.removeEventListener('resize', saveSize)
  }, [detached])

  return (
    <div className={classes.root}>
      {terminalSize !== 'maximized' && (
        <React.Fragment>
          <AppBar position="static" color="default" variant="outlined" className={classes.appbar}>
            <Tabs
              className={classes.tabbar}
              value={value}
              onChange={(e, newValue) => {
                e.stopPropagation()
                handleChange(newValue)
              }}
              indicatorColor="primary"
              textColor="primary">
              <Tab label="Manage" />
              <Tab label="File Manager" />
              <Tab label="Process Manager" />
              <Tab label="Post-Exploitation" />
            </Tabs>
            {!detached && (
              <IconButton
                size="small"
                onClick={() => {
                  const size = Storage.getItem<{ width: number; height: number }>('DetachedSize')
                  const sizeString = size?.height
                    ? `height=${size.height},width=${size.width}`
                    : 'height=600,width=800'
                  window.open(
                    window.location.origin +
                      `/detached_agent?${new URLSearchParams(agent as any).toString()}`,
                    '_blank',
                    sizeString,
                  )
                }}>
                3
              </IconButton>
            )}
          </AppBar>
          <SwipeableViews
            containerStyle={{ height: '100%' }}
            className={classes.tabs}
            index={value}
            onChangeIndex={handleChange}>
            <TabPanel value={value} index={0}>
              <Manage {...agent} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <FileManager />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <ProcessManager terminalSize={terminalSize} detached={detached} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <PostExploitation terminal={terminalRef.current} />
            </TabPanel>
          </SwipeableViews>
        </React.Fragment>
      )}
      <ZTerminal
        ref={(e) => (terminalRef.current = e)}
        terminalSize={terminalSize}
        onTerminalResize={(newSize) => setTerminalSize(newSize)}
        {...agent}
      />
    </div>
  )
}

const useClasses = makeStyles((theme) => ({
  appbar: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: theme.spacing(1),
  },
  tabbar: {
    flex: 1,
  },
  root: ({ height, detached }: any) => ({
    height: height - (detached ? 0 : 140),
    display: 'flex',
    flexDirection: 'column',
  }),
  tabs: {
    padding: theme.spacing(2),
    flex: 1,
  },
}))

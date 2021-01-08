import { AppBar, makeStyles, Tab, Tabs, IconButton } from '@material-ui/core'
import { useNavigatorConfig } from 'material-navigator'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import TabPanel from '../../components/TabPanel'
import Terminal from 'terminal-in-react'
import { useWindowSize } from 'material-crud'
import Manage from './Manage'
import FileManager from './FileManager'
import ProcessManager from './ProcessManager'
import PostExploitation from './PostExploitation'
import { useLocation } from 'react-router-dom'
import {
  FaExternalLinkAlt,
  FaWindowMinimize,
  FaWindowMaximize,
  FaWindowRestore,
} from 'react-icons/fa'
import Storage from '../../util/Storage'

export interface AgentProps {
  id: number
  c2: number
  listener: number
  creation_date: Date
  first_conection: Date
  last_conection: Date
  username: string
  hostname: string
}

interface Props extends Partial<AgentProps> {
  detached?: boolean
}

type TerminalSize = 'minimizezd' | 'normal' | 'maximized'

export default ({ detached, hostname }: Props) => {
  useNavigatorConfig(
    detached ? { onlyContent: true } : { title: 'Agents', noPadding: true, goBack: true },
  )
  const { height } = useWindowSize()
  const [value, setValue] = useState(0)
  // const { state } = useLocation<AgentProps>()

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
                  window.open(window.location.origin + '/detached_agent', '_blank', sizeString)
                }}>
                <FaExternalLinkAlt />
              </IconButton>
            )}
          </AppBar>
          <SwipeableViews className={classes.tabs} index={value} onChangeIndex={handleChange}>
            <TabPanel value={value} index={0}>
              <Manage />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <FileManager />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <ProcessManager />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <PostExploitation />
            </TabPanel>
          </SwipeableViews>
        </React.Fragment>
      )}
      <div className={classes.terminal}>
        <Terminal
          style={{ fontWeight: 'bold', fontSize: '1em' }}
          color="white"
          prompt="white"
          backgroundColor="black"
          barColor="black"
          startState="maximised"
          allowTabs={false}
          hideTopBar
          msg={hostname}
        />
        <div className={classes.terminalBtns}>
          <IconButton
            disabled={terminalSize === 'minimizezd'}
            size="small"
            onClick={() => setTerminalSize('minimizezd')}>
            <FaWindowMinimize />
          </IconButton>
          <IconButton
            disabled={terminalSize === 'normal'}
            size="small"
            onClick={() => setTerminalSize('normal')}>
            <FaWindowRestore />
          </IconButton>
          <IconButton
            disabled={terminalSize === 'maximized'}
            size="small"
            onClick={() => setTerminalSize('maximized')}>
            <FaWindowMaximize />
          </IconButton>
        </div>
      </div>
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
  terminal: ({ terminalSize }: any) => ({
    transition: theme.transitions.create('height', {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.sharp,
    }),
    height: terminalSize === 'normal' ? 175 : terminalSize === 'maximized' ? '100%' : 24,
    position: 'relative',
  }),
  terminalBtns: {
    backgroundColor: 'white',
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    position: 'absolute',
    top: 0,
    right: 0,
  },
}))

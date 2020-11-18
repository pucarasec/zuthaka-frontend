import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core'
import { useNavigatorConfig } from 'material-navigator'
import React, { useCallback } from 'react'
import SwipeableViews from 'react-swipeable-views'
import TabPanel from '../../components/TabPanel'
import Terminal from 'terminal-in-react'
import { useWindowSize } from 'material-crud'
import Manage from './Manage'
import FileManager from './FileManager'
import ProcessManager from './ProcessManager'
import PostExploitation from './PostExploitation'

export default () => {
  useNavigatorConfig({ title: 'Agents', noPadding: true })
  const { height } = useWindowSize()
  const classes = useClasses({ height })
  const [value, setValue] = React.useState(0)

  const handleChange = useCallback((newValue: number) => {
    setValue(newValue)
  }, [])

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={(_, newValue) => handleChange(newValue)}
          indicatorColor="primary"
          textColor="primary">
          <Tab label="Manage" />
          <Tab label="File Manager" />
          <Tab label="Process Manager" />
          <Tab label="Post-Exploitation" />
        </Tabs>
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
          msg="Zuthaka Terminal"
        />
      </div>
    </div>
  )
}

const useClasses = makeStyles((theme) => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
  },
  tabs: ({ height }: any) => ({
    padding: theme.spacing(2),
    height: height - 300,
  }),
  terminal: ({ height }: any) => ({
    height: height - 380,
  }),
}))

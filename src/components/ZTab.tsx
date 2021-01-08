import React, { ReactNode } from 'react'
import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import TabPanel from './TabPanel'
import { useWindowSize } from 'material-crud'

interface TabProps {
  tabs: { label: string }[]
  tabsPanel: { children: ReactNode }[]
  indicatorColor?: 'primary' | 'secondary'
  textColor?: 'inherit' | 'primary' | 'secondary'
}

interface AppbarProps {
  appbarPosition?: 'fixed' | 'absolute' | 'relative' | 'static' | 'sticky'
  appbarVariant?: 'elevation' | 'outlined'
  appbarColor?: 'primary' | 'secondary' | 'inherit' | 'transparent' | 'default'
}

type ZTabProps = TabProps & AppbarProps & { value: number; setValue: (newValue: number) => void }

export default (props: ZTabProps) => {
  const { tabs, tabsPanel, indicatorColor, textColor } = props
  const { appbarPosition, appbarColor, appbarVariant } = props
  const { setValue, value } = props

  const { height } = useWindowSize()
  const classes = useClasses({ height })

  return (
    <React.Fragment>
      <AppBar
        position={appbarPosition || 'static'}
        color={appbarColor || 'default'}
        variant={appbarVariant || 'outlined'}
        className={classes.appbar}>
        <Tabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          indicatorColor={indicatorColor || 'primary'}
          textColor={textColor || 'primary'}>
          {tabs.map(({ label }, i) => (
            <Tab label={label} key={i} />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews index={value} onChangeIndex={setValue}>
        {tabsPanel.map(({ children }, i) => (
          <TabPanel value={value} index={i} key={i}>
            {children}
          </TabPanel>
        ))}
      </SwipeableViews>
    </React.Fragment>
  )
}

const useClasses = makeStyles((theme) => ({
  appbar: ({ height }: any) => ({
    margin: theme.spacing(1),
  }),
  tabbar: {
    flex: 1,
  },
  tabs: {
    padding: theme.spacing(2),
    flex: 1,
  },
}))
